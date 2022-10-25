import {PatientModel} from "./patients";
import {PatientResult} from "../pages";
import {useEffect, useState} from "react";
import {encodeText} from "next/dist/server/node-web-streams-helper";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUpAZ, faArrowDownAZ, faArrowUp19, faArrowDown19, faArrowUp91} from "@fortawesome/free-solid-svg-icons";

function PatientConditionsColHeader(props: { onclick: (type: string)=>void, type: string, _type: string, sort: number, title: string, alpha: boolean }) {
    const up = props.alpha ? faArrowUpAZ : faArrowUp91;
    const down = props.alpha ? faArrowDownAZ : faArrowDown19;
    return <th onClick={()=>{props.onclick(props.type)}}>{props.title} { props._type===props.type && <FontAwesomeIcon icon={props.sort === -1 ? up : down}/>}</th>
}
export default PatientConditionsColHeader