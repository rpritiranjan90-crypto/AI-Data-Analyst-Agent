from __future__ import annotations

# ==========================================================
# Application Messages
# ==========================================================

APPLICATION_STARTED = (
    "Application started successfully."
)

APPLICATION_STOPPED = (
    "Application stopped successfully."
)

APPLICATION_INITIALIZED = (
    "Application initialized successfully."
)

HEALTH_CHECK_SUCCESS = (
    "Health check completed successfully."
)

REQUEST_COMPLETED = (
    "Request completed successfully."
)

RESOURCE_CREATED = (
    "Resource created successfully."
)

RESOURCE_UPDATED = (
    "Resource updated successfully."
)

RESOURCE_DELETED = (
    "Resource deleted successfully."
)

# ==========================================================
# Dataset Messages
# ==========================================================

DATASET_UPLOADED = (
    "Dataset uploaded successfully."
)

DATASET_LOADED = (
    "Dataset loaded successfully."
)

DATASET_DELETED = (
    "Dataset deleted successfully."
)

DATASET_CLEANED = (
    "Dataset cleaned successfully."
)

DATASET_ANALYZED = (
    "Dataset analyzed successfully."
)

DATASET_NOT_FOUND = (
    "Dataset not found."
)

DATASET_EMPTY = (
    "Dataset is empty."
)

INVALID_DATASET = (
    "Invalid dataset."
)

# ==========================================================
# Upload Messages
# ==========================================================

FILE_UPLOADED = (
    "File uploaded successfully."
)

FILE_DELETED = (
    "File deleted successfully."
)

INVALID_FILE_TYPE = (
    "Unsupported file type."
)

FILE_TOO_LARGE = (
    "Uploaded file exceeds the maximum allowed size."
)

UPLOAD_FAILED = (
    "File upload failed."
)
# ==========================================================
# Machine Learning Messages
# ==========================================================

MODEL_CREATED = (
    "Machine learning model created successfully."
)

MODEL_TRAINED = (
    "Model trained successfully."
)

MODEL_EVALUATED = (
    "Model evaluated successfully."
)

MODEL_SAVED = (
    "Model saved successfully."
)

MODEL_LOADED = (
    "Model loaded successfully."
)

MODEL_DELETED = (
    "Model deleted successfully."
)

MODEL_RENAMED = (
    "Model renamed successfully."
)

MODEL_NOT_FOUND = (
    "Model not found."
)

MODEL_ALREADY_EXISTS = (
    "Model already exists."
)

MODEL_NOT_TRAINED = (
    "Model has not been trained."
)

# ==========================================================
# Prediction Messages
# ==========================================================

PREDICTION_COMPLETED = (
    "Prediction completed successfully."
)

SINGLE_PREDICTION_COMPLETED = (
    "Single prediction completed successfully."
)

PROBABILITY_PREDICTION_COMPLETED = (
    "Probability prediction completed successfully."
)

PREDICTION_FAILED = (
    "Prediction failed."
)

# ==========================================================
# AutoML Messages
# ==========================================================

AUTOML_STARTED = (
    "AutoML execution started."
)

AUTOML_COMPLETED = (
    "AutoML completed successfully."
)

AUTOML_FAILED = (
    "AutoML execution failed."
)

BEST_MODEL_SELECTED = (
    "Best model selected successfully."
)

# ==========================================================
# Recommendation Messages
# ==========================================================

RECOMMENDATION_GENERATED = (
    "Recommendations generated successfully."
)

PREPROCESSING_RECOMMENDED = (
    "Preprocessing recommendations generated successfully."
)

MODEL_RECOMMENDED = (
    "Model recommendations generated successfully."
)

METRICS_RECOMMENDED = (
    "Evaluation metric recommendations generated successfully."
)

# ==========================================================
# Explainability Messages
# ==========================================================

EXPLANATION_GENERATED = (
    "Explanation generated successfully."
)

FEATURE_IMPORTANCE_GENERATED = (
    "Feature importance generated successfully."
)

MODEL_SUMMARY_GENERATED = (
    "Model summary generated successfully."
)

GLOBAL_EXPLANATION_GENERATED = (
    "Global explanation generated successfully."
)

LOCAL_EXPLANATION_GENERATED = (
    "Local explanation generated successfully."
)
# ==========================================================
# Validation Messages
# ==========================================================

VALIDATION_SUCCESS = (
    "Validation completed successfully."
)

VALIDATION_FAILED = (
    "Validation failed."
)

INVALID_REQUEST = (
    "Invalid request."
)

INVALID_PARAMETER = (
    "Invalid parameter."
)

INVALID_TARGET_COLUMN = (
    "Invalid target column."
)

INVALID_MODEL = (
    "Invalid machine learning model."
)

MISSING_REQUIRED_FIELD = (
    "Required field is missing."
)

UNSUPPORTED_OPERATION = (
    "Requested operation is not supported."
)

# ==========================================================
# Authentication & Authorization
# ==========================================================

UNAUTHORIZED = (
    "Authentication required."
)

FORBIDDEN = (
    "You do not have permission to perform this operation."
)

INVALID_CREDENTIALS = (
    "Invalid credentials."
)

ACCESS_DENIED = (
    "Access denied."
)

TOKEN_EXPIRED = (
    "Authentication token has expired."
)

TOKEN_INVALID = (
    "Invalid authentication token."
)

# ==========================================================
# Generic Error Messages
# ==========================================================

BAD_REQUEST = (
    "Bad request."
)

NOT_FOUND = (
    "Requested resource was not found."
)

CONFLICT = (
    "Resource already exists."
)

INTERNAL_SERVER_ERROR = (
    "An unexpected internal server error occurred."
)

SERVICE_UNAVAILABLE = (
    "Service is temporarily unavailable."
)

OPERATION_FAILED = (
    "Operation failed."
)

UNKNOWN_ERROR = (
    "An unknown error occurred."
)

# ==========================================================
# General Success Messages
# ==========================================================

SUCCESS = (
    "Operation completed successfully."
)

CREATED = (
    "Resource created successfully."
)

UPDATED = (
    "Resource updated successfully."
)

DELETED = (
    "Resource deleted successfully."
)

NO_CONTENT = (
    "No content available."
)


__all__ = [
    # Application
    "APPLICATION_STARTED",
    "APPLICATION_STOPPED",
    "APPLICATION_INITIALIZED",
    "HEALTH_CHECK_SUCCESS",
    "REQUEST_COMPLETED",
    "RESOURCE_CREATED",
    "RESOURCE_UPDATED",
    "RESOURCE_DELETED",

    # Dataset
    "DATASET_UPLOADED",
    "DATASET_LOADED",
    "DATASET_DELETED",
    "DATASET_CLEANED",
    "DATASET_ANALYZED",
    "DATASET_NOT_FOUND",
    "DATASET_EMPTY",
    "INVALID_DATASET",

    # Upload
    "FILE_UPLOADED",
    "FILE_DELETED",
    "INVALID_FILE_TYPE",
    "FILE_TOO_LARGE",
    "UPLOAD_FAILED",

    # ML
    "MODEL_CREATED",
    "MODEL_TRAINED",
    "MODEL_EVALUATED",
    "MODEL_SAVED",
    "MODEL_LOADED",
    "MODEL_DELETED",
    "MODEL_RENAMED",
    "MODEL_NOT_FOUND",
    "MODEL_ALREADY_EXISTS",
    "MODEL_NOT_TRAINED",

    # Prediction
    "PREDICTION_COMPLETED",
    "SINGLE_PREDICTION_COMPLETED",
    "PROBABILITY_PREDICTION_COMPLETED",
    "PREDICTION_FAILED",

    # AutoML
    "AUTOML_STARTED",
    "AUTOML_COMPLETED",
    "AUTOML_FAILED",
    "BEST_MODEL_SELECTED",

    # Recommendation
    "RECOMMENDATION_GENERATED",
    "PREPROCESSING_RECOMMENDED",
    "MODEL_RECOMMENDED",
    "METRICS_RECOMMENDED",

    # Explainability
    "EXPLANATION_GENERATED",
    "FEATURE_IMPORTANCE_GENERATED",
    "MODEL_SUMMARY_GENERATED",
    "GLOBAL_EXPLANATION_GENERATED",
    "LOCAL_EXPLANATION_GENERATED",

    # Validation
    "VALIDATION_SUCCESS",
    "VALIDATION_FAILED",
    "INVALID_REQUEST",
    "INVALID_PARAMETER",
    "INVALID_TARGET_COLUMN",
    "INVALID_MODEL",
    "MISSING_REQUIRED_FIELD",
    "UNSUPPORTED_OPERATION",

    # Authentication
    "UNAUTHORIZED",
    "FORBIDDEN",
    "INVALID_CREDENTIALS",
    "ACCESS_DENIED",
    "TOKEN_EXPIRED",
    "TOKEN_INVALID",

    # Generic Errors
    "BAD_REQUEST",
    "NOT_FOUND",
    "CONFLICT",
    "INTERNAL_SERVER_ERROR",
    "SERVICE_UNAVAILABLE",
    "OPERATION_FAILED",
    "UNKNOWN_ERROR",

    # Generic Success
    "SUCCESS",
    "CREATED",
    "UPDATED",
    "DELETED",
    "NO_CONTENT",
]