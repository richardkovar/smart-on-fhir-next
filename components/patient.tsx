import {PatientModel} from "./patients";
import Link from "next/link";
import patient from "../pages/patient/[patient]";
import {useRouter} from "next/router";

function Patient(props: {patient: PatientModel}) {
    const router = useRouter();
    return <button onClick={()=>{
        router.push(`/patient/${encodeURIComponent(props.patient.id)}`)}
    } className={"p-2 border"}>
        {props.patient.name && <div>{props.patient.name[0].family}, {props.patient.name[0].given[0]}</div> }
        <div>{props.patient.birthDate}</div>
        <div>{props.patient.gender}</div>
    </button>
}

export default Patient