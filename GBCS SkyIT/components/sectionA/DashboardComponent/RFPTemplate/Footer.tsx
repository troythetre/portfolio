import { Button, Group } from "@mantine/core";

import React from "react";
function FooterCustom(){
    const [active, setActive] = React.useState(1);
    const nextStep = () =>
      setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () =>
      setActive((current) => (current > 0 ? current - 1 : current));
  
    const [open, setOpen] = React.useState(false);
return (
    <>

<div className="flex justify-end ">
          <div className="bottom-10">
            <Group position="center" mt="xl">

              <Button
                className="text-yellow-500 rounded-xl w-100 bg-transparent border-2 border-yellow-500"
                onClick={nextStep}
              >
                Next
              </Button>
            </Group>
          </div>
        </div>
</>

);

}
export default FooterCustom;

