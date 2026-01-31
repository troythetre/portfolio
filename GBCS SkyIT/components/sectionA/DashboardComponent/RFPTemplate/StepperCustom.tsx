import { Stepper } from "@mantine/core";
import React from "react";
function StepperCustom(){
    const [active, setActive] = React.useState(1);
    const nextStep = () =>
      setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () =>
      setActive((current) => (current > 0 ? current - 1 : current));
return (
    <>

<div className="w-1300 ">
<div className="pl-100">
  <Stepper
    size="24px"
    color="yellow"
    styles={{
      separator: {
        marginLeft: -10,
        marginRight: -10,
        height: 3,
      },
      step: {
        padding: 10,
        color: "rgb(255, 238, 88)",
      },
      stepBody: {
        display: "none",
      },
    }}
    active={active}
    onStepClick={setActive}
    breakpoint="sm"
  >
    <Stepper.Step allowStepSelect={active > 0}></Stepper.Step>
    <Stepper.Step allowStepSelect={active > 1}></Stepper.Step>
    <Stepper.Step allowStepSelect={active > 2}></Stepper.Step>
    <Stepper.Step allowStepSelect={active > 2}></Stepper.Step>
    <Stepper.Completed></Stepper.Completed>
  </Stepper>
</div>
</div>
<div className="text-white inline-block">
<div className="text-white inline-block pl-75">Project Setup</div>
<div className="text-white inline-block pl-285">Add Members</div>
<div className="text-white inline-block pl-310">Check</div>
<div className="text-white inline-block pl-315">Pick Template</div>
</div>  
</>

);

}
export default StepperCustom;

