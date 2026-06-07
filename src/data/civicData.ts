/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CivicIssue {
  id: string;
  title: string;
  category: string;
  description: string;
  fullText: string;
}

export interface CivicPoll {
  id: string;
  question: string;
  options: string[];
  votes: Record<number, number>;
}

export const SAMPLE_ISSUES: CivicIssue[] = [
  {
    id: "iss_road_upgrade",
    title: "Metro Transit Corridor & Sidewalk Expansion",
    category: "Infrastructure",
    description: "Proposed expansion of the West Boulevard pedestrian pathway, adding dedicated bike corridors and tactile paving for visually impaired citizens.",
    fullText: "The expansion project aims to optimize pedestrian safety along West Boulevard. The layout includes concrete physical barriers separation, tactile guiding strips for the blind, and smart energy-saving solar street lights."
  },
  {
    id: "iss_clean_energy",
    title: "Regional Renewable Microgrid Subsidies",
    category: "Environment",
    description: "Allocating public matching credits to support household battery storage units and district-wide clean solar panel integration panels.",
    fullText: "The proposal aims to reduce peak-load strain on the outdated city grid. Property owners would receive 35% state-funded tax rebates for registering localized battery walls and feeding excess solar electricity back to the municipal system."
  },
  {
    id: "iss_ai_traffic",
    title: "Dynamic Smart Sensor Traffic Grid Installation",
    category: "Public Safety",
    description: "Replacing static timer loops with AI-driven intersection radars to streamline pedestrian safety and reduce vehicle idling.",
    fullText: "An initiative to modernize our congested downtown corridors. Optical sensors and smart radar systems will dynamically adapt street signals based on real traffic volumes, giving priority to emergency vehicles and public buses."
  },
  {
    id: "iss_library_tech",
    title: "Public Library Digitisation & Tech Pod Expansion",
    category: "Public Services",
    description: "Converting physical archives into public digital catalog files and building free modern coworking spaces equipped with developer workstations.",
    fullText: "The expansion of the central library's workspace capacity. The proposal includes acquiring 16 high-performance stations, establishing high-speed Wi-Fi 6 lines, and creating private soundproof Zoom booths for freelancing citizens."
  }
];

export const SAMPLE_POLLS: CivicPoll[] = [
  {
    id: "poll_green_budget",
    question: "How should the municipal governance partition the upcoming $2.4M district green innovation grants?",
    options: [
      "Dedicate 70% to residential solar rebates",
      "Prioritize public parks and tree canopy expansion",
      "Finance zero-emission hybrid shuttle loops"
    ],
    votes: { 0: 452, 1: 322, 2: 201 }
  },
  {
    id: "poll_zoning_rules",
    question: "Do you endorse zoning revisions to create a pedestrian-only commerce lane downtown on weekend nights?",
    options: [
      "Yes, full vehicular restriction from 6 PM to midnight",
      "No, keep roads fully open to support commuter transit",
      "Implement a hybrid model allowing only low-speed public shuttles"
    ],
    votes: { 0: 612, 1: 189, 2: 243 }
  }
];
