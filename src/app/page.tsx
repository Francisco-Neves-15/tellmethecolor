"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Style
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import fStyles from "./style.module.scss"

// Hooks
import { useI18n } from "@/hooks/useI18n";

// Components
import { Container } from "@/components/layout/Container";
import { View } from "@/components/ui/own/View";
import { Input } from "@/components/ui/own/Input";
import { DivisorLine } from "@/components/ui/own/DivisorLine";
import { Text } from "@/components/ui/own/Text";
import { Button } from "@/components/ui/own/Button";
import { Select, TSelectItems, ISelectRef, selectValueIsPrimitive } from "@/components/ui/own/Select";
import { LuHouse } from "react-icons/lu";
import { Slider } from "@/components/ui/own/Slider";



export default function Home() {

  const tHome = useI18n("pag-home");

  const { gColors } = useGlobalStyles();

  const [test, setTest] = useState<TSelectItems | null>(null);
  useEffect(() => {
    console.log(`Selected: ${JSON.stringify(test, null, 2)}`);
  }, [test])

  const test2lista: TSelectItems[] = [
    { id: "0", value: "myVal0", labelList: <><LuHouse/><Text size="body">list0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasa</Text></>, labelBox: "box0" },
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
  const dropdownTest2Ref = useRef<ISelectRef>(null);
  const [test2, setTest2] = useState<TSelectItems | null>(null);

  useEffect(() => {
    console.log(`Selected: ${test}`);
  }, [test])

  useEffect(() => {
    if (!test2) return;
    {!selectValueIsPrimitive(test2) && 
      console.log(`Selected: ${test2}`)
    }
  }, [test2])

  const [slider, setSlider] = useState<number>(0);

  return (
    <Container padding header={true}>

      <input type="range" name="" id="" />

      <Slider
        direction="horizontal"
        indicator="circle"
        value={slider}
        onChangeValue={(v) => { setSlider(v); console.log(v) }}
        allowTrackClick
        step={10}
      />
      <br /><br /><br /><br /><br />
      <Slider
        direction="vertical"
        indicator="circle"
        value={slider}
        onChangeValue={(v) => { setSlider(v); console.log(v) }}
        step={10}
      />

      <br />

      <select name="" id="">
        <option value="a">aaaaaaaa</option>
        <option value="a">aaaaaaaa</option>
        <option value="a">aaaaaaaa</option>
        <option value="a">aaaaaaaa</option>
        <option value="a">aaaaaaaa</option>
      </select>

      <View className="w-full h-full bg-warning/20 flex flex-center" style={{ position: "relative" }}>

        <View style={{ position: "absolute", top: 0, left: 0 }}>
          <Select
            boxStyles={{ boxVariant: "secondary" }}
            items={test2lista}
            value={test2}
            onChangeValue={(i: TSelectItems) => {
              setTest2(i);
            }}
            behavoir="dropdown"
            disabled
          />
        </View>

        <View style={{ position: "absolute", top: 0, right: 0 }}>
          <Select
            items={test2lista}
            value={test2}
            onChangeValue={(i: TSelectItems) => {
              setTest2(i);
            }}
            search
            behavoir="adapt"
          />
        </View>

        <View style={{ position: "absolute", bottom: 0, left: 0 }}>
          <Select
            items={test2lista}
            value={test2}
            onChangeValue={(i: TSelectItems) => {
              setTest2(i);
            }}
            behavoir="adapt"
          />
        </View>

        <View style={{ position: "absolute", bottom: 0, right: 0 }}>
          <Select
            boxStyles={{ className: "bg-danger" }}
            items={test2lista}
            value={test2}
            onChangeValue={(i: TSelectItems) => {
              setTest2(i);
            }}
            behavoir="adapt"
          />
        </View>


      </View>

      <Button
        onClick={() => dropdownTest2Ref.current?.open({ behavior: "modal" })}
      >
        Abrir
      </Button>
      <Select
        ref={dropdownTest2Ref}
        search
        hideButton
        items={[1,2,3,4,5,2,3,4,5,2,3,4,5,2,3,4,5,2,3,4,5]}
        value={test}
        onChangeValue={(i: TSelectItems) => {
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
