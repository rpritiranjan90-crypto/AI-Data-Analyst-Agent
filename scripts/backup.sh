#!/usr/bin/env bash
#
# backup.sh — Automated backup script for AI Data Analyst Agent
#
# Creates compressed, timestamped archives of all persistent data volumes:
#   - uploads/         (user-uploaded datasets)
#   - reports/         (generated PDF/PPTX)
#   - generated_charts/ (chart images)
#   - datasets/        (cleaned/processed data)
#   - cleaned_data/    (cleaned datasets)
#   - charts/          (additional chart outputs)
#
# Usage:
#   ./scripts/backup.sh                       # Backup to ./backups/ relative to project root
#   BACKUP_DIR=/mnt/nas ./scripts/backup.sh    # Backup to custom location (e.g. NAS)
#   BACKUP_DIR=s3://my-bucket ./scripts/backup.sh  # Use S3 (requires awscli configured)
#
# Schedule via cron (daily at 2 AM):
#   0 2 * * * cd /opt/ai-analyst && ./scripts/backup.sh >> /var/log/ai-analyst-backup.log 2>&1
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

BACKUP_DIR="${BACKUP_DIR:-$PROJECT_ROOT/backups}"
TIMESTAMP="$(date +%Y-%m-%d_%H%M%S)"
BACKUP_NAME="ai-analyst-backup-$TIMESTAMP"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# Directories to back up (relative to backend/)
BACKEND_DIR="$PROJECT_ROOT/backend"
BACKUP_TARGETS=(
  "uploads"
  "reports"
  "generated_charts"
  "datasets"
  "cleaned_data"
  "charts"
)

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
  echo -e "${GREEN}[$(date +%Y-%m-%d\ %H:%M:%S)]${NC} $*"
}

warn() {
  echo -e "${YELLOW}[$(date +%Y-%m-%d\ %H:%M:%S)] WARNING:${NC} $*" >&2
}

error() {
  echo -e "${RED}[$(date +%Y-%m-%d\ %H:%M:%S)] ERROR:${NC} $*" >&2
}

# Sanity check
if [ ! -d "$BACKEND_DIR" ]; then
  error "Backend directory not found at $BACKEND_DIR"
  exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_PATH"
log "Backup directory: $BACKUP_PATH"

# Back up each target directory
TOTAL_SIZE=0
BACKED_UP=0
SKIPPED=0
for target in "${BACKUP_TARGETS[@]}"; do
  SRC="$BACKEND_DIR/$target"
  if [ ! -d "$SRC" ]; then
    warn "Source directory $target/ does not exist — skipping"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  # Check if directory has any files
  if [ -z "$(ls -A "$SRC" 2>/dev/null)" ]; then
    warn "Source directory $target/ is empty — skipping"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  log "Backing up $target/ ..."
  if tar czf "$BACKUP_PATH/$target.tar.gz" -C "$BACKEND_DIR" "$target" 2>/dev/null; then
    SIZE=$(du -sh "$BACKUP_PATH/$target.tar.gz" | cut -f1)
    log "  ✓ $target/ → $target.tar.gz ($SIZE)"
    BACKED_UP=$((BACKED_UP + 1))
  else
    error "  ✗ Failed to back up $target/"
    SKIPPED=$((SKIPPED + 1))
  fi
done

# Create a manifest with metadata
MANIFEST="$BACKUP_PATH/MANIFEST.txt"
{
  echo "AI Data Analyst Agent — Backup Manifest"
  echo "=========================================="
  echo "Timestamp: $TIMESTAMP"
  echo "Hostname: $(hostname)"
  echo "Project root: $PROJECT_ROOT"
  echo ""
  echo "Contents:"
  ls -lh "$BACKUP_PATH" | tail -n +2
  echo ""
  echo "Total archived: $BACKED_UP"
  echo "Skipped: $SKIPPED"
} > "$MANIFEST"

log "Manifest written to $MANIFEST"

# Compress everything into a single archive
log "Creating final archive..."
cd "$BACKUP_DIR"
if tar czf "$BACKUP_NAME.tar.gz" "$BACKUP_NAME"; then
  FINAL_SIZE=$(du -sh "$BACKUP_NAME.tar.gz" | cut -f1)
  log "✓ Final archive: $BACKUP_NAME.tar.gz ($FINAL_SIZE)"
  rm -rf "$BACKUP_PATH"
else
  error "Failed to create final archive"
  exit 1
fi

# Clean up old backups (older than RETENTION_DAYS)
if [ "$BACKUP_DIR" != "s3://"* ] && [ -d "$BACKUP_DIR" ]; then
  log "Cleaning up backups older than $RETENTION_DAYS days..."
  DELETED=$(find "$BACKUP_DIR" -name "ai-analyst-backup-*.tar.gz" -mtime +$RETENTION_DAYS -delete -print | wc -l)
  log "  ✓ Removed $DELETED old backup(s)"
fi

# Optional: upload to S3 if BACKUP_DIR is an S3 URI
if [[ "$BACKUP_DIR" == s3://* ]]; then
  if command -v aws &> /dev/null; then
    log "Uploading to S3..."
    aws s3 cp "$BACKUP_DIR/$BACKUP_NAME.tar.gz" "$BACKUP_DIR/"
    log "✓ Uploaded to S3"
  else
    warn "awscli not found — skipping S3 upload"
  fi
fi

log "Backup complete!"
log "Archive: $BACKUP_DIR/$BACKUP_NAME.tar.gz"

# Optional: send notification via webhook
if [ -n "${BACKUP_WEBHOOK_URL:-}" ]; then
  log "Sending notification webhook..."
  curl -sS -X POST -H "Content-Type: application/json" \
    -d "{\"text\": \"AI Analyst backup completed: $BACKUP_NAME.tar.gz ($FINAL_SIZE)\"}" \
    "$BACKUP_WEBHOOK_URL" > /dev/null 2>&1 || warn "Webhook notification failed"
fi

exit 0
