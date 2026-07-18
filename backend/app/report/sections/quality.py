from reportlab.platypus import (
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

from reportlab.lib import colors

from app.report.styles import NORMAL_STYLE

from app.report.helpers import add_section_header

def add_health_score(story, insights):
    add_section_header(
        story,
        "DATASET HEALTH SCORE"
    )

    story.append(
        Paragraph(
            f"<b>Overall Health Score :</b> {insights['health_score']}%",
            NORMAL_STYLE
        )
    )

    story.append(
        Spacer(1,20)
    )
    
def add_missing_values(story, insights):

    add_section_header(
        story,
        "MISSING VALUES"
    )

    table_data = [["Column","Missing"]]

    for column,value in insights["missing_values"].items():

        table_data.append([
            column,
            str(value)
        ])

    table = Table(
        table_data,
        colWidths=[220,220]
    )

    table.setStyle(
        TableStyle([
            ("BACKGROUND",(0,0),(-1,0),colors.darkgreen),
            ("TEXTCOLOR",(0,0),(-1,0),colors.white),
            ("GRID",(0,0),(-1,-1),1,colors.black),
            ("BACKGROUND",(0,1),(-1,-1),colors.whitesmoke),
            ("ALIGN",(0,0),(-1,-1),"CENTER"),
        ])
    )

    story.append(table)

    story.append(
        Spacer(1,20)
    )
def add_outlier_analysis(story, insights):

    add_section_header(
        story,
        "OUTLIER ANALYSIS"
    )

    table_data = [["Column","Outliers"]]

    for column,value in insights["outliers"].items():

        table_data.append([
            column,
            str(value)
        ])

    table = Table(
        table_data,
        colWidths=[220,220]
    )

    table.setStyle(
        TableStyle([
            ("BACKGROUND",(0,0),(-1,0),colors.orange),
            ("TEXTCOLOR",(0,0),(-1,0),colors.white),
            ("GRID",(0,0),(-1,-1),1,colors.black),
            ("BACKGROUND",(0,1),(-1,-1),colors.beige),
            ("ALIGN",(0,0),(-1,-1),"CENTER"),
        ])
    )

    story.append(table)

    story.append(
        Spacer(1,20)
    )
def add_strong_correlation_analysis(story, insights):

    add_section_header(
        story,
        "STRONG CORRELATION ANALYSIS"
    )

    table_data = [["Column 1","Column 2","Correlation"]]

    if insights["strong_correlations"]:

        for item in insights["strong_correlations"]:

            table_data.append([
                item["column_1"],
                item["column_2"],
                str(item["correlation"])
            ])

    else:

        table_data.append([
            "No Strong Correlation",
            "-",
            "-"
        ])

    table = Table(
        table_data,
        colWidths=[160,160,120]
    )

    table.setStyle(
        TableStyle([
            ("BACKGROUND",(0,0),(-1,0),colors.darkred),
            ("TEXTCOLOR",(0,0),(-1,0),colors.white),
            ("GRID",(0,0),(-1,-1),1,colors.black),
            ("BACKGROUND",(0,1),(-1,-1),colors.whitesmoke),
            ("ALIGN",(0,0),(-1,-1),"CENTER"),
        ])
    )

    story.append(table)

    story.append(
        Spacer(1,20)
    )
