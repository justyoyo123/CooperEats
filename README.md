# CooperEats

## ECE366 - Spring 2024
### Diego Toribio, Justin Koe, Eric Taeyoo Kim, and Hailey Hayoon Chung

## What is CooperEats?
CooperEats allows the Cooper Union community to order items, including lunch boxes, drinks, and desserts, from the one and only cafeteria in 41 Cooper Square: Frankie's Cafeteria.

As a user, you can check the daily menu, create orders, make payments online, and schedule the pickup time.

As an admin, you can edit the quantity of remaining items, and check received orders through the dashboard.

## Video Walkthrough
Check out this video walkthrough of the CooperEats webpage, demonstrating all the features available to users:
[![Watch the Video](/coopereats-app/walkthrough_thumbnail.png)](https://drive.google.com/file/d/1IdtyKMnTN49ry8z-YaWWk_cLj9oQ9AWB/view?usp=sharing)


## How to Run Test Coverage
The tests were written for the original version of the backend which is on springboot_user_auth. To reproduce the coverage results, you will need to checkout to springboot_user_auth branch, then to the for_test_coverage branch. Then, the Inteillij profiling tool can be used.

## Screenshot of test coverage
![Test Coverage](/coopereats-app/test_coverage.PNG)


## Software Engineering Ethics
> 1.01. Accept full responsibility for their own work.

The CooperEats team demonstrates adherence to the engineering ethic of accepting full responsibility for their own work through their collaborative approach to project management and execution. Each team member is assigned specific tasks and components, fostering individual accountability. The project timeline includes a proposal submission, backend and database demos, and local working project demos leading to a final presentation. This phased approach ensures that team members remain responsible for their deliverables at each stage, providing opportunities for review and assessment of their work. By following a clear project roadmap with set deadlines, team members can be held accountable for their contributions, ensuring that the ethic of accepting full responsibility is embedded within the project's culture.

> 1.02. Moderate the interests of the software engineer, the employer, the client and the users with the public good.

In developing CooperEats, our team consistently moderated the interests of various stakeholders involved to ensure our project aligns with the broader public good. We prioritized developing features and functionalities that meet the needs and expectations of our immediate users, but also contributed to the larger Cooper Union community. The CooperEats platform not only serves its immediate purpose but also reflects ethical considerations and social responsibilities.

> 2.02. Not knowingly use software that is obtained or retained either illegally or unethically.

The CooperEats team used all mainstream software such as Spring and React which were obtained through the official websites.

> 3.02. Ensure proper and achievable goals and objectives for any project on which they work or propose.

CooperEats achieves the engineering ethics of ensuring proper and achievable goals and objectives by creating a structured project plan with clear deliverables and a realistic workflow. The project proposal outlines a system to enhance the food ordering experience at Cooper Union’s cafeteria, Frankie’s kitchen. It specifies features categorized as required, realistic, and extra, showcasing a scalable approach to project development. The team has identified risks associated with web security, indicating proactive planning. With regular team meetings and a distribution of work that includes learning and application of technologies like Spring Boot and Postgres, CooperEats sets achievable milestones. This systematic approach ensures that each team member contributes effectively towards the project’s goals, with contingency plans for potential roadblocks. 

> 3.10. Ensure adequate testing, debugging, and review of software and related documents on which they work.

The CooperEats team wrote tests for every component of the service layer, achieving 50% test coverage. This streamlined progress in frontend development as there were not many bugs in the main paths of the workflows. In the event there was an issue, mainly in edge cases, the bugs were analyzed and traced to the root in the backend service layer where it was then resolved. All major code was also reviewed by all team members through Pull Requests on Github to minimize the chances of problematic code making it into the codebase.

> 6.01. Help develop an organizational environment favorable to acting ethically.

The CooperEats team organized work and set short term goals between major deadlines to ensure constant progress and no rushed work right before a major deliverable. This allowed the team to act ethically when developing the product as members were not rushed or pressured to complete the necessary tasks.

> 7.03. Credit fully the work of others and refrain from taking undue credit.

Using Github as a code management platform means all the code being written is attached to one of the team members. As a result, credit is inherently given to the committer and no team member is able to take undue credit. 

> 7.05. Give a fair hearing to the opinions, concerns, or complaints of a colleague.

At CooperEats, open communication is the bedrock of our team dynamics. We ensure every voice is heard through active team chats, thorough peer reviews on GitHub, and collaborative weekly meetings. These practices embody our commitment to ethical standards, fostering a respectful, supportive, and growth-oriented work environment.

> 8.01. Further their knowledge of developments in the analysis, specification, design, development, maintenance and testing of software and related documents, together with the management of the development process.

CooperEats has been mainly utilizing GitHub Issues and Readme documents to keep record and manage our development process. Test coverage results can also be found in our Github repository.

> 8.04. Improve their understanding of the software and related documents on which they work and of the environment in which they will be used.

Throughout the development process of CooperEats, our team consistently enhanced our understanding of the software and its related documents, as well as the environment in which it would be utilized. We actively engaged in documenting technical specifications and design documents, to make sure everyone is on the same page and is able to recreate the same developing environment.
