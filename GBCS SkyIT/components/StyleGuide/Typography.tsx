interface Typography {
    example: string;
    fontSize: string;
}

const typography: Typography[] = [
    { example: "Caption2", fontSize: "13px" },
    { example: "Caption1", fontSize: "16px" },
    { example: "Footnote", fontSize: "18px" },
    { example: "Subheadline", fontSize: "20px" },
    { example: "Callout", fontSize: "21px" },
    { example: "Body", fontSize: "22px" },
    { example: "Headline", fontSize: "22px" },
    { example: "Title3", fontSize: "24px" },
    { example: "Title2", fontSize: "28px" },
    { example: "Title1", fontSize: "34px" },
    { example: "Large Title", fontSize: "41px" },
];

interface TypographyProps {
    styles: { [key: string]: string };
}

const Typography = ({ styles }: TypographyProps) => {
    return (
        <section className={styles.section} id="typograph">
            <div className={styles.headers}>
                <h3 className="text-4xl">Typography</h3>
                <p className="text-base">
                    Font: Poppins
                </p>
            </div>
            <table className="w-full">
                <thead>
                    <tr >
                        <th className="text-center text-2xl">Font Size</th>
                        <th className="text-center text-2xl">Regular Styles</th>
                        <th className="text-center text-2xl">Bold Styles</th>
                    </tr>
                </thead>
                <tbody>
                    {typography.map((element: Typography) => (
                        <tr key={element.example}>
                            <td
                                style={{ fontSize: element.fontSize }}
                            >
                                {element.fontSize}
                            </td>
                            <td
                                style={{ fontSize: element.fontSize, fontWeight: "normal" }}
                            >
                                {element.example}
                            </td>
                            <td
                                style={{ fontSize: element.fontSize, fontWeight: "bold" }}
                            >
                                {element.example}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default Typography;
