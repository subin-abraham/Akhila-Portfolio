-- Align homepage content with Akhila Anns Jacob's resume.
-- Replaces placeholder journey/education/skills/tools and corrects hero, social, and section copy.
-- Leaves portfolio-only surfaces (worked_with, case-study/testimonial nav anchors) unchanged.

-- ---------------------------------------------------------------------------
-- Hero
-- ---------------------------------------------------------------------------

update public.homepage
set
  full_name = 'Akhila Anns Jacob',
  intro = 'Embedded Software Developer with 2.5 years of experience in automotive embedded systems, specializing in NXP processors and vehicle application software. Experienced in developing custom installable Simulink libraries and implementing real-time calibration of vehicle parameters to optimize torque–speed maps. Strong expertise in firmware development, including bootloader design, memory mapping, and secure application flashing for NXP platforms. Proficient in automotive communication protocols such as CAN, LIN, and UDS, with hands-on experience in diagnostic communication and secure software deployment.',
  cta_label = 'Let''s get started',
  cta_href = '#contact',
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Social links (resume: LinkedIn + email; drop placeholder Behance/Twitter)
-- ---------------------------------------------------------------------------

delete from public.social_links;

insert into public.social_links (platform, href, sort_order) values
  ('linkedin', 'https://www.linkedin.com/in/akhila-anns-jacob-0ab272187', 1),
  ('whatsapp', 'https://wa.me/919539476070', 2);

-- ---------------------------------------------------------------------------
-- Professional journey (most recent first)
-- ---------------------------------------------------------------------------

delete from public.professional_journey;

insert into public.professional_journey (
  role,
  organization,
  location,
  period,
  description,
  sort_order
) values
  (
    'Automotive Embedded Developer',
    'OPTM Private Limited',
    'Pune, India',
    'Aug 2025 — Present',
    'Designed and developed a custom secondary bootloader for the NXP S32K312 (ARM Cortex-M7) using NXP RTD and S32 Design Studio 3.5, enabling controlled firmware programming and application startup. Built C40 Flash IP drivers for sector erase, unlock, programming, and memory management; integrated a custom ISO-TP (CAN-TP) transport layer for segmented diagnostic transfer; and developed a UDS (ISO 14229) diagnostic stack with Default, Extended, and Programming sessions, Security Access, and negative response handling. Validated flashing and diagnostics with ECUbus Pro and performed JTAG-based low-level debugging across bootloader, Flash, CAN/ISO-TP, and UDS workflows.',
    1
  ),
  (
    'Automotive Embedded Developer',
    'Dorle Controls Private Limited',
    'Pune, India',
    'May 2024 — Aug 2025',
    'Developed and tested embedded application software for Vehicle Control Units using MATLAB/Simulink and NXP-based platforms. Configured CAN and LIN communication (message configuration, signal handling, testing, and troubleshooting) and built model-based software with reusable Simulink library blocks focused on modularity and optimization. Worked with NXP S32 Design Studio for AUTOSAR MCAL configuration and integration, used NXP FreeMASTER for runtime monitoring and calibration, and performed real-time calibration of vehicle parameters including torque–speed characteristics across the full embedded software lifecycle.',
    2
  );

-- ---------------------------------------------------------------------------
-- Education & training (most recent first)
-- ---------------------------------------------------------------------------

delete from public.education;

insert into public.education (
  degree,
  institution,
  location,
  period,
  grade,
  description,
  sort_order
) values
  (
    'Embedded System Software Development',
    'SMEC Automation',
    'Kerala, India',
    'Mar 2024',
    null,
    'Training in designing and implementing software for embedded systems, with hands-on work in MPLAB IDE and Proteus. Built and simulated projects on PIC18F4580, ATmega32, LPC, and Arduino UNO, bridging simulation to hardware for practical debugging and error handling.',
    1
  ),
  (
    'Bachelor of Technology, Electronics and Communication Engineering',
    'A P J Abdul Kalam Technological University',
    'Kerala, India',
    'Apr 2018 — Mar 2022',
    'CGPA 8.1 / 10',
    'Thesis: Partially Paralyzed Speech Impaired Patient Assistant System using Machine Learning. Core focus on electronics and communication engineering with applied embedded and signal-processing foundations.',
    2
  ),
  (
    'Higher Secondary Education',
    'Kerala Board of Higher Secondary Examination',
    'Kerala, India',
    'Apr 2016 — Mar 2018',
    '92.5%',
    'Fields of study: Biology, Chemistry, Physics, and Mathematics.',
    3
  ),
  (
    'Certification of Secondary Education',
    'Indian Certificate of Secondary Education',
    'Kerala, India',
    'Apr 2015 — Mar 2016',
    '81.7%',
    'Fields of study: Physics, Biology, Chemistry, Mathematics, and Computer use.',
    4
  );

-- ---------------------------------------------------------------------------
-- Technical expertise (resume skill groups; proficiency estimated from role depth)
-- ---------------------------------------------------------------------------

delete from public.technical_expertise;

insert into public.technical_expertise (
  category,
  skill,
  proficiency,
  sort_order
) values
  ('Communication Protocols', 'UDS (ISO 14229)', 90, 1),
  ('Communication Protocols', 'CAN / CAN-FD', 92, 2),
  ('Communication Protocols', 'LIN', 86, 3),
  ('Communication Protocols', 'ISO-TP (CAN-TP)', 88, 4),
  ('AUTOSAR & Platforms', 'AUTOSAR MCAL', 85, 5),
  ('AUTOSAR & Platforms', 'AUTOSAR RTE', 80, 6),
  ('AUTOSAR & Platforms', 'ARM Cortex-M', 90, 7),
  ('AUTOSAR & Platforms', 'NXP S32K / RTD', 88, 8),
  ('Firmware & Diagnostics', 'Bootloader Design', 90, 9),
  ('Firmware & Diagnostics', 'Flash Drivers & Memory Mapping', 88, 10),
  ('Firmware & Diagnostics', 'Secure Application Flashing', 86, 11),
  ('Debugging & Updates', 'JTAG / SWD', 88, 12),
  ('Debugging & Updates', 'Memory / Register Inspection', 85, 13),
  ('Debugging & Updates', 'Git Version Control', 84, 14);

-- ---------------------------------------------------------------------------
-- Tools and technology (resume development tools)
-- ---------------------------------------------------------------------------

delete from public.tools_and_technology;

insert into public.tools_and_technology (category, name, sort_order) values
  ('Languages', 'Embedded C', 1),
  ('Model-Based Design', 'MATLAB', 2),
  ('Model-Based Design', 'Simulink', 3),
  ('NXP Toolchain', 'S32 Design Studio', 4),
  ('NXP Toolchain', 'S32 Configuration Tool', 5),
  ('NXP Toolchain', 'NXP FreeMASTER', 6),
  ('NXP Toolchain', 'NXP RTD', 7),
  ('Diagnostics & Bus', 'CAN Analyser', 8),
  ('Diagnostics & Bus', 'ECUbus Pro', 9),
  ('Workflow', 'Visual Studio Code', 10),
  ('Workflow', 'Git', 11),
  ('Training Bench', 'MPLAB IDE', 12),
  ('Training Bench', 'Proteus', 13);

-- ---------------------------------------------------------------------------
-- Section copy aligned to automotive embedded focus
-- ---------------------------------------------------------------------------

insert into public.homepage_sections (
  section_key,
  eyebrow,
  title,
  accent_title,
  description,
  highlight_target
) values
  (
    'professional_journey',
    'Experience',
    'Professional Journey',
    null,
    'Automotive embedded roles focused on NXP platforms, vehicle application software, diagnostics, and secure firmware deployment.',
    'title'
  ),
  (
    'education',
    'Academics',
    'Education',
    '& Training',
    'Formal education in electronics and communication, plus hands-on embedded systems training that bridges simulation to hardware.',
    'title'
  ),
  (
    'technical_expertise',
    'Capabilities',
    'Technical',
    'Expertise',
    'Automotive communication, AUTOSAR-oriented NXP platforms, bootloader and flashing workflows, and low-level debugging.',
    'accent'
  ),
  (
    'tools_and_technology',
    'Toolkit',
    'Tools',
    '& Technology',
    'The day-to-day stack for model-based development, NXP tooling, bus diagnostics, and embedded C workflows.',
    'accent'
  )
on conflict (section_key) do update set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  accent_title = excluded.accent_title,
  description = excluded.description,
  highlight_target = excluded.highlight_target,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Footer brand copy + Connect links (real LinkedIn; mailto for resume email)
-- ---------------------------------------------------------------------------

update public.footer
set
  brand_name = 'Akhila',
  tagline = 'Embedded Software Developer specializing in automotive systems, NXP platforms, and diagnostic firmware.',
  status_label = 'Open to collaborations',
  cta_label = 'Let''s get started',
  cta_href = '#contact',
  copyright_name = 'Akhila Anns Jacob',
  updated_at = now();

delete from public.footer_links
where column_key = 'connect';

insert into public.footer_links (
  column_key,
  column_title,
  label,
  href,
  sort_order,
  column_sort_order
) values
  ('connect', 'Connect', 'Let''s get started', '#contact', 1, 3),
  (
    'connect',
    'Connect',
    'LinkedIn',
    'https://www.linkedin.com/in/akhila-anns-jacob-0ab272187',
    2,
    3
  ),
  (
    'connect',
    'Connect',
    'Email',
    'mailto:jacob.akhilaanns@gmail.com',
    3,
    3
  );
