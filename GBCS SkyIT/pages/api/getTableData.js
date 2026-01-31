// pages/api/data.js
const getData = (req, res) => {
  // Mock data (replace with actual backend data retrieval logic)
  const data = [
    {
      question: "Proposed Product for WorldVisions Global Fleet",
      answer:
        "Most of our competitors’ technology service offerings are limited to a few components of the overall fleet management process. These components typically involve maintenance and repair management systems or asset tracking software such as GPS or telematics services. For GBCS Group, developing a technology that will integrate and fulfill all of the foundational elements of fleet management for our partners is our core purpose. These elements are built around an understanding that assets follow a lifecycle from procurement to disposal. Each time the asset undergoes an activity or process within that lifecycle, data generated is tracked in the $software$ system. Accordingly, to meet the fleet management technology needs of $company_name$, GBCS Group proposes that $company_name$ consider implementing the $software$ to accomplish the requirements of this RFP, inlcuding [list scope of work requirements that are found in the RFP].(Suggest high quality graphic demonstrating the fleet lifecycle, that includes the exact names of the modules in $software$)By working closely with our partners and drawing from the experience of our fleet management staff, GBCS Group has recognized that fleet managers often make decisions based on “gut feelings, lacking access to immediate information necessary to make sound, evidence-based decisions backed up with sound data. At $company_name$, this can, not only lead to a suboptimal performing fleet of expensive assets, but the continual expense of paying for something that could have been a warranty or not necessary at all. $software$ seeks to enhance the decision-making process by supplying real-time data to $company_name$. This is achieved through Internet of Things (IoT) Enterprise Resource Planning (ERP) solutions. IoT ERP will enable $company_name$ to measure real-time performance and health of its fleet with asset-level accuracy. This precision can then allow $company_name$’s executive, management, and operators to make the best decisions on behalf of $company_name$.$software$’s communication process interacts between $company_name$’s internal stakeholders, such as asset operators, management, executives, as well as external stakeholders including suppliers, service providers, charters, and governing bodies. $software$’s user interface is easy to read and has been purposefully buillt to ensure users with little experience using software can understand every action they take. Further, GBCS provides extensive training on the use of $software$ and data provided for fleet monitoring is easy to read and available for customers to read.n alignment with the [insert local national/provincial/state name]’s environmental, social, and governance objectives and targets of reducing greenhouse gas (GHG) emissions, $company_name$ will also be able to leverage $software$’s capability of tracking and managing its fleet asset carbon output on a per asset basis. This means that $company_name$ can achieve a measurable reduction in its GHG emissions. Using the $software$ system, $company_name$’s fleet assets that are maintained and operating in accordance with optimal manufacturing specifications will be economically efficient, which also means they are more likely to perform within acceptable GHG targets. ",
      software: "LokoMotive",
      topic: "Company History",
      subTopic: "LokoMotive Overview",
    },
    {
      question: "Project description and location",
      answer:
        "Project description and location:Stage One - Discovery Project - Port Manatee, Florida, USA, and Hamilton, Ontario, CAN: GBCS delivered complete fleet management and inventory assessment. Through a detailed audit, including operational reviews with key fleet personnel, GBCS Group produced an extensive report of fleet management opportunities and recommendations with focus areas such as assessment of current assets, disposal and maintenance strategies, cost forecasting for the next five years, and utilization of technologies within daily fleet operations.Stage Two - Procurement Project - Port Manatee, Florida, USA: Federal Marine Terminals (FMT) retained GBCS Group to provide direction and fleet advisory services concerning the procurement of industrial vehicles for FMT’s Port Manatee, Tampa, Florida operating location. GBCS Group was tasked to provide fleet management insight and subject matter expertise in determining the optimal vendor for procurement, ultimately delivering fit-for-purpose, reliable, and cost-effective assets to improve FMT’s stevedoring, terminal handling, and logistics operations.",
      software: "LokoMotive",
      topic: "Description",
      subTopic: "Project Description",
    },
    {
      question:
        "Provide cost comparisons and analysis of performing certain fleet services in-house versus contracting them to private vendors. Provide advantages and disadvantages for both service delivery options, and best practices.",
      answer:
        "In-House Services Advantages:  - Convenient, on-site repairs and maintenance- Typically more cost-efficient on an hourly basis (long term) - May have a better understanding of in-house fleet conditions - Higher understanding of business expectations/ clearer communication- Faster working start times- Shorter downtime Disadvantages:- Limited to a certain expertise- Limited to in-house equipment - Personal issues - Must have mechanics on site - Increased facility and staffing costs Outsourcing ServicesAdvantages: - Specialized personnel may be outsourced for specific work- Specific contracting needs (Niche)- Finding the right vendor with the appropriate equipment- Expertise/tools that may be too expensive to have in house- Vendor responsible for the cost of continuous training and equipment upgrades Disadvantages:- Higher per hour cost- High downtime- Less communication/ business understanding Best Practices: - Understanding the frequency/ priority list of what service needs to be done.  - Having in-house service is beneficial when the service being provided is consistent and happens frequently within the year. - Specific requirements that are not seen often should be taken out-house for proper expertise. - Service delivery and expectations should be revisited and measured throughout the contract period to ensure optimal delivery of established KPIs.",
      software: "LokoMotive",
      topic: "Maintenance & Repair Strategy",
      subTopic: "In-House vs Out-House",
    },
    {
      question:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget metus commodo suscipit ultrices. Dignissim proin ultrices lacus sit et cursus. Viverra cras bibendum aliquet vestibulum pellentesque ipsum. Urna urna ultricies tristique duis at fusce at diam commodo. Vehicula ac dignissim erat donec risus turpis orci amet. Nec nec cras sed tristique eleifend. Quis enim donec nibh tempus. Feugiat sit nunc posuere convallis. In sit id egestas ac tempus.",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget metus commodo suscipit ultrices. Dignissim proin ultrices lacus sit et cursus. Viverra cras bibendum aliquet vestibulum pellentesque ipsum. Urna urna ultricies tristique duis at fusce at diam commodo. Vehicula ac dignissim erat donec risus turpis orci amet. Nec nec cras sed tristique eleifend. Quis enim donec nibh tempus. Feugiat sit nunc posuere convallis. In sit id egestas ac tempus.",
      software: "Aukai",
      topic: "I’m Topic",
      subTopic: "I’m Sub-Topic",
    },
    // Add more data items as needed
  ];

  res.status(200).json(data);
};
export default getData;
