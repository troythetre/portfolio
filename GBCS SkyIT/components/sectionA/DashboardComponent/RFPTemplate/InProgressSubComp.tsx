import { Button, Group } from "@mantine/core";
// import { useState } from "react";
import StepperCustom from "../InProgressSubComp/StepperCustom";
import React from "react";
import FooterCustom from "./Footer";

function AddTeamMembers() {
  const [active, setActive] = React.useState(1);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>

        <StepperCustom></StepperCustom>

       <FooterCustom></FooterCustom>
      
    </>
  );
}
export default AddTeamMembers;
