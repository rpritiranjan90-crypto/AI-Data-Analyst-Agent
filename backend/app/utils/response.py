def success_response(
    message: str,
    chart: str = None,
    rows: int = None,
    columns: int = None,
    **extra
):

    response = {
        "success": True,
        "message": message
    }

    if chart:
        response["chart"] = chart

    if rows is not None:
        response["rows"] = rows

    if columns is not None:
        response["columns"] = columns

    response.update(extra)

    return response


def error_response(message: str):

    return {
        "success": False,
        "message": message
    }