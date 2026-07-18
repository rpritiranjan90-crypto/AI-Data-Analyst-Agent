from app.services.dataset_service import get_latest_dataset


class ContextBuilder:
    """
    Builds AI context from the current dataset.
    """

    @staticmethod
    def build():

        dataset = get_latest_dataset()

        return {
            "rows": len(dataset),
            "columns": list(dataset.columns),
            "shape": dataset.shape,
            "preview": dataset.head(5).to_dict(orient="records"),
        }