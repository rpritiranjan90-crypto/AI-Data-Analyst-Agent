import matplotlib.pyplot as plt
import seaborn as sns


def setup_chart(config):

    sns.set_theme(style=config.theme)

    plt.figure(
        figsize=(config.width, config.height)
    )

    if config.title:
        plt.title(config.title)


def finish_chart(chart_path, config):

    plt.xticks(rotation=config.rotation)

    plt.tight_layout()

    plt.savefig(
        chart_path,
        dpi=config.dpi,
        format=config.image_format
    )

    plt.close()