import { Flex, Heading, Link, Separator } from '@chakra-ui/react';
import { ColorModeButton } from './ui/color-mode';

export function Header() {

  return (
    <header>
      <Flex justify="space-between" align="center">
        <Flex gap="1rem" align="center">
          <Heading size="2xl">3-Months Planner</Heading>
          <nav>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
            </ul>
          </nav>
        </Flex>
        <Flex gap="5px" align="center">
          <ColorModeButton />
        </Flex>
      </Flex>
      <Separator margin="1rem 0" />
    </header>
  )
}
