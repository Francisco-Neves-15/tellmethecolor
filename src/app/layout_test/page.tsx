"use client";
// import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// Style
import useGlobalStyles from "@/hooks/useGlobalStyles";

// Icons
import { LuHouse } from "react-icons/lu";

// Components
import { Container} from "@/components/layout/Container";
import { View} from "@/components/ui/own/View";
import { Text} from "@/components/ui/own/Text";
import { Button} from "@/components/ui/own/Button";

export default function Home() {
  const { gColors } = useGlobalStyles();

  return (
    <Container padding>

      <View className="flex flex-row gap-4">
        <Link href={"/settings"}>settings</Link>
        <Link href={"/"}>home</Link>
      </View>

      <Button>Continuar</Button>
      <Button variant="secondary">Continuar</Button>
      <Button variant="main" color="primary">Continuar</Button>
      <Button variant="outline" color="success">Continuar</Button>

      {/* Testes de Botões */}

      <Link href={"/settings"}>
        <Button>
          link + button
        </Button>
      </Link>

      <Button>buton + text</Button>
      <Button><LuHouse size={24} /> Color </Button>
      
      <Button><Text size="button">buton + text</Text></Button>

      <Button>button</Button>
      <Button color="primary" variant="outline" underline><LuHouse size={24} /> button underline</Button>

      <hr />

      <Button><Text size="display">link + button + text</Text></Button>
      <Button><Text size="h1">link + button + text</Text></Button>
      <Button><Text size="h2">link + button + text</Text></Button>
      <Button><Text size="h3">link + button + text</Text></Button>
      <Button><Text size="body">link + button + text</Text></Button>
      <Button><Text size="caption">link + button + text</Text></Button>
      <Button><Text size="micro">link + button + text</Text></Button>
      <Button><Text size="nano">link + button + text</Text></Button>
      <Button><Text size="button">link + button + text</Text></Button>
      <Button>link + button + text</Button>

      {/* Testes de Botões */}

      <hr />
      
      <Text size="display">link + button + text</Text>
      <Text size="h1">link + button + text</Text>
      <Text size="h2">link + button + text</Text>
      <Text size="h3">link + button + text</Text>
      <Text size="body">link + button + text</Text>
      <Text size="caption">link + button + text</Text>
      <Text size="micro">link + button + text</Text>
      <Text size="nano">link + button + text</Text>
      <Text size="button">link + button + text</Text>

      <hr />

      <Link href={"/settings"}>link</Link>
    </Container>
  );
}
