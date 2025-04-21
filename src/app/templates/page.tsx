'use client';
import { usePlanContext } from '@/app/providers/usePlanContext';
import TemplateGallery from '@/app/templates/TemplateGallery';
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from "react";
import { HiOutlineArrowSmallLeft } from 'react-icons/hi2';
import { PiFileTextThin } from 'react-icons/pi';
// import { Layout } from "@/components/Layout";
// import { usePlan } from "@/context/PlanContext";
// import { NeumorphicCard } from "@/components/ui/neumorphic-card";
// import { TemplateGallery } from "@/components/TemplateGallery";
// import { Button } from "@/components/ui/button";
// import { FileText, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { SubscriptionGuard } from "@/components/SubscriptionGuard";

const Templates = () => {
  const { plan: currentPlan } = usePlanContext();
  const navigate = useRouter();

  return (
    // <Layout> //TODO: To be implemented
    <div>
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate.push("/")}
          className="mr-2"
        >
          <HiOutlineArrowSmallLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold gradient-text">
          <PiFileTextThin className="inline-block mr-2 h-8 w-8" />
          Goal Templates
        </h1>
      </div>

      {/* //TODO: To be implemented */}
      {/* <SubscriptionGuard
        feature="templates"
        title="Premium Feature: Goal Templates"
        description="Access a library of pre-built goal templates to jumpstart your planning process with a premium subscription."
      > */}
      {/* <NeumorphicCard>//TODO: To be implemented */}
          <TemplateGallery />
        {/* </NeumorphicCard> */}
      {/* </SubscriptionGuard> */}
    </div>
  );
};

export default Templates;
