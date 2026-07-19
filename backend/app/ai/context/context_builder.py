from app.services.dataset_cache import DatasetCache


class ContextBuilder:
    """
    Builds AI context from the currently loaded dataset.
    """

    @staticmethod
    def build():

        dataset = DatasetCache.get_dataset()

        if dataset is None:
            return {
                "rows": 0,
                "columns": [],
                "shape": (0, 0),
                "preview": [],
            }

        return {
            "rows": len(dataset),
            "columns": list(dataset.columns),
            "shape": dataset.shape,
            "preview": dataset.head(5).to_dict(orient="records"),
        }