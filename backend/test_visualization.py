from __future__ import annotations

import json

import requests

BASE_URL = "http://127.0.0.1:8000"

TESTS = [

    # Basic Charts

    {
        "chart_type": "histogram",
        "column": "Age",
    },

    {
        "chart_type": "bar",
        "column": "Department",
    },

    {
        "chart_type": "pie",
        "column": "Department",
    },

    {
        "chart_type": "donut",
        "column": "Department",
    },

    {
        "chart_type": "countplot",
        "column": "Gender",
    },

    {
        "chart_type": "boxplot",
        "column": "Salary",
    },

    {
        "chart_type": "kde",
        "column": "Age",
    },

    {
        "chart_type": "scatter",
        "x_column": "Age",
        "y_column": "Salary",
    },

    {
        "chart_type": "bubble",
        "x_column": "Age",
        "y_column": "Salary",
        "size_column": "Performance",
    },

    {
        "chart_type": "line",
        "x_column": "Experience",
        "y_column": "Salary",
    },

    {
        "chart_type": "area",
        "x_column": "Experience",
        "y_column": "Salary",
    },

    {
        "chart_type": "heatmap",
    },

    # Advanced

    {
        "chart_type": "violin",
        "column": "Salary",
    },

    {
        "chart_type": "strip",
        "column": "Salary",
    },

    {
        "chart_type": "swarm",
        "column": "Salary",
    },

    {
        "chart_type": "hexbin",
        "x_column": "Age",
        "y_column": "Salary",
    },

    {
        "chart_type": "pairplot",
    },

    {
        "chart_type": "parallel",
    },

    {
        "chart_type": "scatter3d",
        "x_column": "Age",
        "y_column": "Salary",
        "z_column": "Performance",
    },

    {
        "chart_type": "radar",
        "values": {
            "Communication": 80,
            "Leadership": 70,
            "Coding": 95,
            "Teamwork": 90,
            "Problem Solving": 88,
        },
    },

    # Plotly

    {
        "chart_type": "treemap",
        "column": "Department",
    },

    {
        "chart_type": "sunburst",
        "column": "Department",
    },

    {
        "chart_type": "icicle",
        "column": "Department",
    },

    {
        "chart_type": "sankey",
        "source_column": "Department",
        "target_column": "City",
    },

    {
    "chart_type": "waterfall",
    "category_column": "Department",
    "value_column": "Salary",
},

    {
    "chart_type": "funnel",
    "stage_column": "Department",
    "value_column": "Salary",
},

    {
        "chart_type": "gauge",
        "value": 85,
    },

    {
        "chart_type": "bullet",
        "value": 80,
        "target": 90,
    },

    {
        "chart_type": "wordcloud",
        "column": "Department",
    },
]


def run_test(payload):

    url = f"{BASE_URL}/visualization/generate"

    response = requests.post(
        url,
        json=payload,
        timeout=120,
    )

    return response.status_code, response.text


def main():

    print("=" * 70)
    print("Visualization Integration Test")
    print("=" * 70)

    passed = 0
    failed = 0

    for payload in TESTS:

        chart = payload["chart_type"]

        print(f"\nTesting: {chart}")

        status, response = run_test(payload)

        if status == 200:

            print("PASS")

            passed += 1

        else:

            print("FAIL")

            print(f"Status : {status}")

            try:

                print(
                    json.dumps(
                        json.loads(response),
                        indent=4,
                    )
                )

            except Exception:

                print(response)

            failed += 1

    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)

    print(f"Passed : {passed}")

    print(f"Failed : {failed}")

    print(f"Total  : {len(TESTS)}")


if __name__ == "__main__":

    main()