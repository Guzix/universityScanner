import React from 'react';
import {PackExtendedDtoPackStatusEnum} from "../../openapi/models";
import {t} from "../../misc/misc";
import {Button, Steps} from "antd";

const {Step} = Steps;

type Step = {
    enumValue?: PackExtendedDtoPackStatusEnum;
    polishText: string;
    description: string;
    index: number;
}
const steps: Step[] = [
    {polishText: "NULL", description: "Etap nie jest wprowadzony", index: 0},
    {enumValue: PackExtendedDtoPackStatusEnum.INIT, polishText: "Zainicjowano", description: "Opis etapu 'Zainicjowano'", index: 1},
    {enumValue: PackExtendedDtoPackStatusEnum.CONFIRMED, polishText: "Potwierdzono", description: "Opis etapu 'Potwierdzono'", index: 2},
    {enumValue: PackExtendedDtoPackStatusEnum.PACKED, polishText: "Zapakowano", description: "Opis etapu 'Zapakowano'", index: 3},
    {enumValue: PackExtendedDtoPackStatusEnum.SENT, polishText: "Wysłano", description: "Opis etapu 'Wysłano'", index: 4}
]

export const PackProgress: React.FC<{packStatus:PackExtendedDtoPackStatusEnum  | undefined, setPackStatus: (object: PackExtendedDtoPackStatusEnum | undefined) => void }> = ({packStatus, setPackStatus}) => {
    const [activeStep, setActiveStep] = React.useState<Step>(steps[0]);
    const [nextButtonEnabled, setNextButtonEnabled] = React.useState<boolean>(true);

    const handleNext = () => {
        const newStep = steps.find(step => step.index === (activeStep ? activeStep.index + 1 : 0)) || steps[0];
        setPackStatus(newStep.enumValue);
        setNextButtonEnabled(!nextButtonEnabled);
    };
    React.useEffect(() => {
        setActiveStep(steps.find(step => step.enumValue === packStatus) || steps[0]);
    }, [packStatus]);

    return (
        <div style={{width: "100%", marginTop: "1em"}}>
            <Steps current={activeStep.index}>
                {steps.map((step) => <Step key={step.enumValue} title={step.polishText}/>)}
            </Steps>
            <div>
                {activeStep.index === steps.length - 1 ? (
                    <div>
                        <div className={"basic-v-margin"}>{activeStep.description}</div>
                        <div className={"basic-v-margin"}>{t("All steps completed")}</div>
                    </div>
                ) : (
                    <div>
                        <div className={"basic-v-margin"}>{activeStep.description}</div>
                        <div className={"basic-v-margin"}>
                            {nextButtonEnabled && <Button type="primary" color="primary" onClick={handleNext}>
                                {activeStep.index === steps.length - 1 ? t("Finish") : t("Next")}
                            </Button>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
