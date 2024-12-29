import { Heading, Textarea } from '@chakra-ui/react';

export function Step1() {
  return (
    <div>
      <Heading size="2xl">Create your long term vision</Heading>
      <p>
        Dare to dream without limits. Picture a future where you've achieved everything you’ve ever desired. Be bold and dream unapologetically—this is your life, your vision, your legacy. What passions have you followed fearlessly? What does fulfillment look like in your career, relationships, and personal growth? Envision a life where every choice you make aligns with your deepest values and aspirations. Let your imagination run free, embrace your wildest ambitions, and create a vision that excites and motivates you every day. Dream as if failure isn’t an option, and let your boldness pave the way.
      </p>
      <Textarea variant="outline" placeholder="Think big. What are the dreams you’ve always wanted to pursue? How would your life look if you reached your full potential? Be bold and dream unapologetically." />
    </div>
  )
}
