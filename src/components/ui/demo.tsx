/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import AnoAI from "@/components/ui/animated-shader-background";

const DemoOne: React.FC = () => {
  return (
    <div className="w-full h-screen bg-black relative">
      <AnoAI/>
    </div>
  );
};

export { DemoOne };
