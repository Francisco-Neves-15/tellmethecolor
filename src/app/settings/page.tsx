"use client";
// import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// Style
import useGlobalStyles from "@/hooks/useGlobalStyles";

// Components

// Icons
import Container from "@/components/ui/Container";
import View from "@/components/ui/View";
import Button from "@/components/ui/Button";

export default function Settings() {
  const { gColors } = useGlobalStyles();

  return (
    <Container padding>
      <View className="flex flex-row gap-4">
        <Link href={"/"}>home</Link>
        <Link href={"/layout_test"}>settings</Link>
      </View>
      <Link href={"/"}>
        <Button>
          Voltar
        </Button>
      </Link>
    </Container>
  );
}
