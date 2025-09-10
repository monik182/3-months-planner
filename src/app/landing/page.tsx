"use client";
import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  SimpleGrid,
  Badge,
  List,
  // Link as ChakraLink,
} from "@chakra-ui/react";

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <Box as="section" id={id} className={className} py={{ base: 12, md: 20 }}>
      <Container maxW="6xl">{children}</Container>
    </Box>
  );
}

// function Nav() {
//   return (
//     <Box as="header" borderBottom="1px" borderColor="gray.200" className="sticky top-0 z-40 bg-white/80 backdrop-blur">
//       <Container maxW="6xl">
//         <HStack py={4} justify="space-between">
//           <HStack gap={2}>
//             <Box className="h-6 w-6 rounded-sm bg-black" />
//             <Text fontWeight="bold">MC Code Studio</Text>
//           </HStack>
//           <HStack gap={6} className="hidden md:flex">
//             <ChakraLink href="#planner">Planner</ChakraLink>
//             <ChakraLink href="#meal">Meal Analyzer</ChakraLink>
//             <ChakraLink href="#pricing">Pricing</ChakraLink>
//             <ChakraLink href="#faq">FAQ</ChakraLink>
//           </HStack>
//           <HStack gap={3}>
//             <Button asChild variant="outline" size="sm"><a href="#pricing">Start trial</a></Button>
//             <Button asChild variant="solid" size="sm"><a href="#pricing">Buy now</a></Button>
//           </HStack>
//         </HStack>
//       </Container>
//     </Box>
//   );
// }

function Hero() {
  return (
    <Section>
      <VStack gap={6} textAlign="center">
        <Badge variant="outline" px={3} py={1}>15‑day free trial</Badge>
        <Heading size={{ base: "xl", md: "2xl" }} lineHeight={1.1}>
          Simple tools that get you results.
        </Heading>
        <Text maxW="3xl" color="gray.600">
          Minimal UI. Real outcomes. Start a 15‑day trial, then keep it if it works for you.
        </Text>
        <HStack gap={3} className="justify-center">
          <Button variant="solid" size="lg" asChild>
            <a href="#planner">Try The Planner</a>
          </Button>
        </HStack>
        <Text fontSize="sm" color="gray.500">No credit card? Use the demo video below.</Text>
      </VStack>
    </Section>
  );
}

function ProductPlanner() {
  return (
    <Section id="planner" className="bg-gray-50">
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={12} alignItems="center">
        <VStack align="start" gap={6}>
          <Heading size="lg">The Planner — 12‑Week Year, simplified</Heading>
          <Text color="gray.700">
            Set a 12‑week plan, define measurable goals, and close your week with clarity. No feeds, no noise — just progress.
          </Text>
          <List.Root gap={3} color="gray.700">
            <List.Item>3 steps: Plan → Goals & metrics → Weekly review</List.Item>
            <List.Item>Minimal, distraction‑free interface</List.Item>
            <List.Item>Exports & cloud sync (Pro)</List.Item>
          </List.Root>
          <HStack gap={3}>
            <Button
              asChild
              variant="solid"
            >
              <a href="https://buy.stripe.com/test_planner_annual">Start 15‑day trial</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#faq">See how it works</a>
            </Button>
          </HStack>
          <Text fontSize="sm" color="gray.600">After trial: <strong>€10/year</strong> (Founding price · first 100).</Text>
        </VStack>
        <Box className="rounded-2xl border border-gray-200 p-6 shadow-sm bg-white">
          <Text mb={3} fontWeight="bold">Quick demo (2 min)</Text>
          <Box className="aspect-video w-full rounded-lg border border-black/10 bg-gray-100" />
          <Text mt={3} fontSize="sm" color="gray.600">Embed your Loom/YT demo here.</Text>
        </Box>
      </SimpleGrid>
    </Section>
  );
}

// function ProductMeal() {
//   return (
//     <Section id="meal">
//       <SimpleGrid columns={{ base: 1, md: 2 }} gap={12} alignItems="center">
//         <Box className="order-2 md:order-1 rounded-2xl border border-gray-200 p-6 shadow-sm bg-white">
//           <Text mb={3} fontWeight="bold">Quick demo (1 min)</Text>
//           <Box className="aspect-video w-full rounded-lg border border-black/10 bg-gray-100" />
//           <Text mt={3} fontSize="sm" color="gray.600">Embed your Loom/YT demo here.</Text>
//         </Box>
//         <VStack align="start" gap={6} className="order-1 md:order-2">
//           <Heading size="lg">AI Meal Analyzer — Macros in seconds</Heading>
//           <Text color="gray.700">
//             Paste what you ate; get an instant macro estimate. Edit portions, save favorites, duplicate meals, and export.
//           </Text>
//           <List.Root gap={3} color="gray.700">
//             <List.Item>30‑second macro estimates you can adjust</List.Item>
//             <List.Item>History, favorites, CSV/PDF export (Pro)</List.Item>
//             <List.Item>Built for speed — no clutter</List.Item>
//           </List.Root>
//           <HStack gap={3}>
//             <Button
//               asChild
//               variant="solid"
//             >
//               <a href="https://buy.stripe.com/test_meal_monthly">Start 15‑day trial</a>
//             </Button>
//             <Button asChild variant="outline">
//               <a href="#pricing">See pricing</a>
//             </Button>
//           </HStack>
//           <Text fontSize="sm" color="gray.600">After trial: <strong>€1.99/month</strong> or <strong>€14.99/year</strong>.</Text>
//         </VStack>
//       </SimpleGrid>
//     </Section>
//   );
// }

function Pricing() {
  return (
    <Section id="pricing" className="bg-gray-50">
      <VStack gap={8} textAlign="center">
        <Heading size="lg">Fair, simple pricing</Heading>
        <Text color="gray.600">15‑day free trial. Cancel anytime in 2 clicks.</Text>
      </VStack>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} mt={10}>
        <Box className="rounded-2xl border border-gray-300 p-6 shadow-sm bg-white">
          <VStack align="start" gap={4}>
            <HStack justify="space-between" w="full">
              <Heading size="md">The Planner</Heading>
              <Badge variant="solid">Annual</Badge>
            </HStack>
            <Text fontSize="4xl" fontWeight="bold">€10<span className="text-lg font-normal">/year</span></Text>
            <Text color="gray.600">Founding price for the first 100 users.</Text>
            {/* <Divider /> */}
            <List.Root gap={2} color="gray.700">
              <List.Item>Unlimited plans</List.Item>
              <List.Item>Unlimited goals & weekly reviews</List.Item>
              {/* <List.Item>Cloud sync & exports</List.Item> */}
              <List.Item>Priority support</List.Item>
            </List.Root>
            <Button asChild variant="solid" size="lg" w="full">
              <a href="https://buy.stripe.com/test_planner_annual">Start 15‑day trial</a>
            </Button>
          </VStack>
        </Box>
        {/* <Box className="rounded-2xl border border-gray-300 p-6 shadow-sm bg-white">
          <VStack align="start" gap={4}>
            <HStack justify="space-between" w="full">
              <Heading size="md">AI Meal Analyzer</Heading>
              <Badge variant="bw">Monthly / Annual</Badge>
            </HStack>
            <HStack align="baseline" gap={6}>
              <Text fontSize="4xl" fontWeight="bold">€1.99<span className="text-lg font-normal">/mo</span></Text>
              <Text fontSize="xl" color="gray.600">or €14.99/year</Text>
            </HStack>
            <Text color="gray.600">Built for speed with editable macro estimates.</Text>
            <Divider />
            <List.Root gap={2} color="gray.700">
              <List.Item>Fast text‑to‑macros</List.Item>
              <List.Item>History & favorites</List.Item>
              <List.Item>CSV/PDF export</List.Item>
            </List.Root>
            <HStack w="full" gap={3}>
              <Button as={ChakraLink} href="https://buy.stripe.com/test_meal_monthly" variant="outline" w="full">Start trial (Monthly)</Button>
              <Button as={ChakraLink} href="https://buy.stripe.com/test_meal_yearly" variant="outline" w="full">Start trial (Annual)</Button>
            </HStack>
          </VStack>
        </Box> */}
      </SimpleGrid>
      <Text mt={6} fontSize="sm" color="gray.600" textAlign="center">
        You will be charged after 15 days if you don’t cancel. Manage your subscription in your customer portal.
      </Text>
    </Section>
  );
}

function FAQ() {
  return (
    <Section id="faq">
      <VStack gap={8}>
        <Heading size="lg" textAlign="center">FAQ</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
          <Box>
            <Heading size="sm" mb={2}>Is there a free plan?</Heading>
            <Text color="gray.700">No. We offer a 15‑day free trial. If it helps you, keep it. If not, cancel in two clicks.</Text>
          </Box>
          <Box>
            <Heading size="sm" mb={2}>Do I need a credit card for the trial?</Heading>
            <Text color="gray.700">Yes. You will not be charged until the trial ends. We’ll email you reminders.</Text>
          </Box>
          <Box>
            <Heading size="sm" mb={2}>Can I cancel anytime?</Heading>
            <Text color="gray.700">Yes. Manage your plan in the customer portal. No questions asked.</Text>
          </Box>
          <Box>
            <Heading size="sm" mb={2}>Do you handle invoices & VAT?</Heading>
            <Text color="gray.700">Yes. Our payment processor automatically takes care of invoices and EU VAT.</Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </Section>
  );
}

// function Footer() {
//   return (
//     <Box as="footer" borderTop="1px" borderColor="gray.200" py={10} className="bg-white">
//       <Container maxW="6xl">
//         <VStack gap={3}>
//           <Text fontWeight="medium">© {new Date().getFullYear()} MC Code Studio</Text>
//           <HStack gap={6}>
//             <ChakraLink href="#">Terms</ChakraLink>
//             <ChakraLink href="#">Privacy</ChakraLink>
//             <ChakraLink href="#">Contact</ChakraLink>
//           </HStack>
//         </VStack>
//       </Container>
//     </Box>
//   );
// }

export default function LandingPage() {
  return (
    <Box className="min-h-screen bg-white text-black">
      {/* <Nav /> */}
      <Hero />
      <ProductPlanner />
      {/* <ProductMeal /> */}
      <Pricing />
      <FAQ />
      {/* <Footer /> */}
    </Box>
  );
}
