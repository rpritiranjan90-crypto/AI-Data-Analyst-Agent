import json


class ContextSerializer:
    """
    Converts AI context into formatted text.
    """

    @staticmethod
    def serialize(context: dict) -> str:

        return json.dumps(
            context,
            indent=2,
            default=str
        )