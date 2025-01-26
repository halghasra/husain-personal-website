#!/bin/bash

# Base directory
BASE_DIR="content/learning-hub/computer-science-fundamentals"

# Create directories
mkdir -p "$BASE_DIR/1-laying-the-groundwork/1-basic-concepts-of-data-processing"
mkdir -p "$BASE_DIR/2-information-layer/2-information-representation"
mkdir -p "$BASE_DIR/3-hardware-layer/3-algorithms-and-data-structures"
mkdir -p "$BASE_DIR/3-hardware-layer/4-logic-and-digital-circuits"
mkdir -p "$BASE_DIR/3-hardware-layer/5-hardware-and-computer-architectures"
mkdir -p "$BASE_DIR/4-communications-layer/6-networks-and-the-internet"
mkdir -p "$BASE_DIR/5-operating-systems-layer/7-software"
mkdir -p "$BASE_DIR/6-applications-layer/8-computer-science-as-a-discipline"

# Create index.md files in directories
touch "$BASE_DIR/index.md"
touch "$BASE_DIR/1-laying-the-groundwork/index.md"
touch "$BASE_DIR/1-laying-the-groundwork/1-basic-concepts-of-data-processing/index.md"
touch "$BASE_DIR/2-information-layer/index.md"
touch "$BASE_DIR/2-information-layer/2-information-representation/index.md"
touch "$BASE_DIR/3-hardware-layer/index.md"
touch "$BASE_DIR/3-hardware-layer/3-algorithms-and-data-structures/index.md"
touch "$BASE_DIR/3-hardware-layer/4-logic-and-digital-circuits/index.md"
touch "$BASE_DIR/3-hardware-layer/5-hardware-and-computer-architectures/index.md"
touch "$BASE_DIR/4-communications-layer/index.md"
touch "$BASE_DIR/4-communications-layer/6-networks-and-the-internet/index.md"
touch "$BASE_DIR/5-operating-systems-layer/index.md"
touch "$BASE_DIR/5-operating-systems-layer/7-software/index.md"
touch "$BASE_DIR/6-applications-layer/index.md"
touch "$BASE_DIR/6-applications-layer/8-computer-science-as-a-discipline/index.md"

# Create markdown files for each section
touch "$BASE_DIR/1-laying-the-groundwork/1-basic-concepts-of-data-processing/1-1-data-information-and-messages.md"
touch "$BASE_DIR/1-laying-the-groundwork/1-basic-concepts-of-data-processing/1-2-software-firmware-and-hardware.md"
touch "$BASE_DIR/1-laying-the-groundwork/1-basic-concepts-of-data-processing/1-3-languages-syntax-and-semantics.md"
touch "$BASE_DIR/1-laying-the-groundwork/1-basic-concepts-of-data-processing/1-4-historical-overview-of-computers.md"

touch "$BASE_DIR/2-information-layer/2-information-representation/2-1-number-representation-formats.md"
touch "$BASE_DIR/2-information-layer/2-information-representation/2-2-representation-of-non-numerical-information.md"
touch "$BASE_DIR/2-information-layer/2-information-representation/2-3-data-types.md"
touch "$BASE_DIR/2-information-layer/2-information-representation/2-4-redundancy-and-error-tolerance.md"

touch "$BASE_DIR/3-hardware-layer/3-algorithms-and-data-structures/3-1-algorithms-and-flowcharts.md"
touch "$BASE_DIR/3-hardware-layer/3-algorithms-and-data-structures/3-2-simple-data-structures.md"
touch "$BASE_DIR/3-hardware-layer/3-algorithms-and-data-structures/3-3-searching-and-sorting.md"
touch "$BASE_DIR/3-hardware-layer/3-algorithms-and-data-structures/3-4-quality-of-algorithms.md"

touch "$BASE_DIR/3-hardware-layer/4-logic-and-digital-circuits/4-1-boolean-algebra-and-logic-gates.md"
touch "$BASE_DIR/3-hardware-layer/4-logic-and-digital-circuits/4-2-truth-tables-and-logical-formulas.md"
touch "$BASE_DIR/3-hardware-layer/4-logic-and-digital-circuits/4-3-digital-circuit-design.md"

touch "$BASE_DIR/3-hardware-layer/5-hardware-and-computer-architectures/5-1-basic-elements-of-computer-architecture.md"
touch "$BASE_DIR/3-hardware-layer/5-hardware-and-computer-architectures/5-2-processors-and-memory.md"
touch "$BASE_DIR/3-hardware-layer/5-hardware-and-computer-architectures/5-3-input-and-output-processing.md"
touch "$BASE_DIR/3-hardware-layer/5-hardware-and-computer-architectures/5-4-operating-systems-and-hardware-communication.md"
touch "$BASE_DIR/3-hardware-layer/5-hardware-and-computer-architectures/5-5-high-performance-computing.md"

touch "$BASE_DIR/4-communications-layer/6-networks-and-the-internet/6-1-wired-and-wireless-networks-and-topologies.md"
touch "$BASE_DIR/4-communications-layer/6-networks-and-the-internet/6-2-the-osi-model-and-tcp-ip.md"
touch "$BASE_DIR/4-communications-layer/6-networks-and-the-internet/6-3-internet-structure-and-services.md"
touch "$BASE_DIR/4-communications-layer/6-networks-and-the-internet/6-4-the-internet-of-things.md"

touch "$BASE_DIR/5-operating-systems-layer/7-software/7-1-bios.md"
touch "$BASE_DIR/5-operating-systems-layer/7-software/7-2-file-systems.md"
touch "$BASE_DIR/5-operating-systems-layer/7-software/7-3-application-software-for-operating-systems.md"
touch "$BASE_DIR/5-operating-systems-layer/7-software/7-4-embedded-systems.md"
touch "$BASE_DIR/5-operating-systems-layer/7-software/7-5-software-development.md"

touch "$BASE_DIR/6-applications-layer/8-computer-science-as-a-discipline/8-1-the-role-of-computer-science-in-the-modern-workforce.md"
touch "$BASE_DIR/6-applications-layer/8-computer-science-as-a-discipline/8-2-different-types-of-jobs-related-to-computer-science.md"
touch "$BASE_DIR/6-applications-layer/8-computer-science-as-a-discipline/8-3-artificial-intelligence-and-data-science.md"
touch "$BASE_DIR/6-applications-layer/8-computer-science-as-a-discipline/8-4-ethics-of-computer-science.md"
