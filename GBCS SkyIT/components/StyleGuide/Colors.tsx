import { Card, Text } from "@mantine/core";

interface Color {
    colorTitle: string;
    colorScheme: string;
    colorClass: string;
}

const colors: Color[] = [
    {
        colorTitle: "Black",
        colorScheme: "#000000",
        colorClass: "black",
    },
    {
        colorTitle: "Black Gradient 1",
        colorScheme: "#000000 - #494949",
        colorClass: "black_gradient_one",
    },
    {
        colorTitle: "Primary GBCS Black",
        colorScheme: "#2F2F2F",
        colorClass: "primary_gbcs_black",
    },
    {
        colorTitle: "Black Overlay Gradient",
        colorScheme: "#000000 (26% - 44% - 72% - 87% - 100%)",
        colorClass: "black_overlay_gradient",
    },
    {
        colorTitle: "Grey Accent",
        colorScheme: "#555555",
        colorClass: "grey_accent",
    },
    {
        colorTitle: "Black Gradient 2",
        colorScheme: "#2F2F2F (0%) - #181818 (79%) - #000000",
        colorClass: "black_gradient_two",
    },
    {
        colorTitle: "GBCS Platinum 1",
        colorScheme: "#B5B5B5 - #585858 - #A5A5A5 - #585858",
        colorClass: "gbcs_platinum_one",
    },
    {
        colorTitle: "GBCS Platinum 2",
        colorScheme: "#EBEAEA - #BFBFBF - #E0E0E0 - #C3C3C3",
        colorClass: "gbcs_platinum_two",
    },
    {
        colorTitle: "White",
        colorScheme: "#FFFFFF",
        colorClass: "white",
    },
    {
        colorTitle: "GBCS Gold",
        colorScheme: "#DEBF1A - #F2E28A - #D9C03C - #EDDA75",
        colorClass: "gbcs_gold",
    },
    {
        colorTitle: "GBCS Gold Solid",
        colorScheme: "#FFE34E",
        colorClass: "gbcs_gold_solid",
    },
];

interface ColorsProps {
    styles: { [key: string]: string };
}

const Colors = ({ styles }: ColorsProps) => {
    return (
        <section className={`${styles.section}`} id="colors">
            <div className={`${styles.headers}`}>
                <h3 className="text-4xl">Colors</h3>
                <p className="text-base">You can access the CSS code for each color in the <span className={styles.span}>styleguide.modulo.css</span> folder</p>
            </div>
            <div className={`grid grid-cols-3 gap-4`}>
                {colors.map((color: Color) => (
                    <Card key={color.colorClass} shadow="sm" p="xl" className={` ${styles.color_card}`} id={color.colorTitle}>
                        <Card.Section>
                            <div
                                style={{ height: "50px" }}
                                className={styles[color.colorClass]}
                            />
                        </Card.Section>

                        <Text weight={500} size="lg">
                            {color.colorTitle}
                        </Text>

                        <Text size="sm">{color.colorScheme}</Text>
                    </Card>
                ))}
            </div>

        </section>
    );
};

export default Colors