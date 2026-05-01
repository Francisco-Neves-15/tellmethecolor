"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Style
import useGlobalStyles from "@/hooks/useGlobalStyles";
import fStyles from "./style.module.scss"

// Hooks
import { useI18n } from "@/hooks/useI18n";

// Components
import Container from "@/components/layout/Container";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import { SelectDropdown, TDropdownItems, ISelectDropdownRef } from "@/components/ui/SelectDropdown";
import Button from "@/components/ui/Button";
import { LuHouse } from "react-icons/lu";



export default function Home() {

  const tHome = useI18n("pag-home");

  const { gColors } = useGlobalStyles();

  const [test, setTest] = useState<TDropdownItems | null>(null);
  useEffect(() => {
    console.log(`Selected: ${JSON.stringify(test, null, 2)}`);
  }, [test])

  const test2lista: TDropdownItems[] = [
    { id: "0", value: "myVal0", labelList: <><LuHouse/><Text size="body">list0</Text></>, labelBox: "box0" },
    { id: "1", value: "myVal1", labelList: <Text size="body">list1</Text>, labelBox: "box1" },
    { id: "2", value: "myVal2", labelList: <Text size="body">list2</Text>, labelBox: "box2" },
    { id: "3", value: "myVal3", labelList: <Text size="body">list3</Text>, labelBox: "box3" },
    { id: "4", value: "myVal4", labelList: <Text size="body">list4</Text>, labelBox: "box4" },
    { id: "5", value: "myVal5", labelList: <Text size="body">list5</Text>, labelBox: "box5" },
    { id: "6", value: "myVal6", labelList: <Text size="body">list6</Text>, labelBox: "box6" },
    { id: "7", value: "myVal7", labelList: <Text size="body">list7</Text>, labelBox: "box7" },
    { id: "8", value: "myVal8", labelList: <Text size="body">list8</Text>, labelBox: "box8" },
    { id: "9", value: "myVal9", labelList: <Text size="body">list8</Text>, labelBox: "box8" },
    { id: "10", value: "myVal10", labelList: <Text size="body">list10</Text>, labelBox: "box10" },
  ]
  const dropdownTest2Ref = useRef<ISelectDropdownRef>(null);
  const [test2, setTest2] = useState<TDropdownItems | null>(null);
  useEffect(() => {
    console.log(`Selected: ${JSON.stringify(test, null, 2)}`);
  }, [test])

  return (
    <Container padding header={false}>

      <SelectDropdown
        items={[1,2,3,4,5,2,3,4,5,2,3,4,5,2,3,4,5,2,3,4,5]}
        value={test}
        onChangeValue={(i) => {
          setTest(i);
        }}
      />

      <Button
        onClick={() => dropdownTest2Ref.current?.toggle()}
      >
        Abrir
      </Button>
      <SelectDropdown
        ref={dropdownTest2Ref}
        hideButton
        items={test2lista}
        value={test}
        onChangeValue={(i) => {
          setTest(i);
        }}
      />

      <View className="flex flex-row gap-4">
        <Link href={"/settings"}>settings</Link>
        <Link href={"/layout_test"}>layout_test</Link>
      </View>

      <View className={fStyles.content}>
        Test
        {/* <Link href={"/layout_test/"}>Teste</Link> */}
        {/* <Link href={"/settings/"}>Setting</Link> */}
      </View>

    </Container>
  );
}
