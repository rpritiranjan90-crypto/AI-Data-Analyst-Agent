import pandas as pd


def validate_dataset(df):

    if df is None:
        raise ValueError("No dataset uploaded")


def validate_column(df, column):

    if column not in df.columns:
        raise ValueError(f"{column} column not found")


def validate_numeric_column(df, column):

    validate_column(df, column)

    if not pd.api.types.is_numeric_dtype(df[column]):
        raise ValueError(f"{column} must be numeric")


def validate_multiple_numeric_columns(df, columns):

    for column in columns:
        validate_numeric_column(df, column)