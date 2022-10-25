import {PatientModel} from "./patients";
import {PatientResult} from "../pages";
import {useEffect, useState} from "react";
import {encodeText} from "next/dist/server/node-web-streams-helper";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUpAZ, faArrowDownAZ, faArrowUp19, faArrowDown19} from "@fortawesome/free-solid-svg-icons";
import PatientConditionsColHeader from "./patient-conditions-col-header";

export interface ConditionModel {
    resourceType: string,
    id: string,
    meta: {
        versionId: string,
        lastUpdated: string,
        tag: Array<{
            system: string,
            code: string
        }>
    }
    clinicalStatus: {
        coding: Array<{
            system: string,
            code: string
        }>
    },
    verificationStatus: {
        coding: Array<{
            system: string,
            code: string
        }>
    },
    code: {
        coding: Array<{
            system: string,
            code: string
        }>
        text: string
    },
    subject: {
        reference: string
    },
    encounter: {
        reference: string
    },
    onsetDateTime: string,
    recordedDate: string,
    abatementDateTime: string
}

export interface ConditionResult {
    fullUrl: string,
    resource: ConditionModel,
    search: {
        mode: string
    },
    response: {
        status: string,
        etag: string
    }
}

export interface ConditionsResult {
    resourceType: string,
    id: string,
    meta: {
        lastUpdated: string
    },
    type: string,
    link: Array<{
        relation: string,
        url: string,
    }>,
    entry: Array<ConditionResult>,
    search: {
        mode: string
    },
    response: {
        status: string,
        etag: string
    }
}

//TODO: Implement better type checking as FHIR models seem to have many variables.

function PatientDetails(props: { patient: PatientModel, conditions: ConditionsResult }) {

    const [domLoaded, setDomLoaded] = useState(false);

    const [sortType, setSortType] = useState('onsetDate');

    const [sortDirection, setSortDirection] = useState(-1);

    useEffect(() => {
        setDomLoaded(true);
    }, []);

    const handleHeaderClick = (_sortType: string) => {
        if(_sortType !== sortType){
            setSortType(_sortType);
            setSortDirection(1)
        }else{
            setSortDirection(sortDirection*-1)
        }
        console.log(sortType,sortDirection)
    }

    return <>
        {domLoaded &&
            <div className={"gap-3"}>
                <div>
                    <span className={"text-lg font-bold"}>Names </span>
                    {props.patient.name && props.patient.name.map((name, i) => {
                        return <span key={`${name}-${i}`}>[{name.family}, {name.given}, {name.prefix}]</span>
                    })}
                </div>
                <div>
                    <span className={"text-lg font-bold"}>Gender </span>
                    <span>{props.patient.gender}</span>
                </div>
                <div>
                    <span className={"text-lg font-bold"}>Birth </span>
                    <span>{new Date(props.patient.birthDate).toLocaleDateString()}</span>
                </div>
                {props.patient.deceasedDateTime && <div>
                    <span className={"text-lg font-bold"}>Death </span>
                    <span>{new Date(props.patient.deceasedDateTime).toLocaleString()}</span>
                </div>}
                <div>
                    <span className={"text-lg font-bold"}>Age </span>
                    <span>{yearsSince(new Date(props.patient.birthDate), props.patient.deceasedDateTime ? new Date(props.patient.deceasedDateTime) : undefined).toFixed(1)} years</span>
                </div>
                <div className={"pt-2"}>
                    <span className={"text-lg font-bold"}>Conditions </span>
                    <table className={"table-auto border-combined border border-slate-500 w-full"}>
                        <thead className={"text-left border border-b-1 border-slate-500"}>
                            <tr>
                                <PatientConditionsColHeader onclick={handleHeaderClick} type={"condition"} _type={sortType} sort={sortDirection} title={"Condition"} alpha={true}/>
                                <PatientConditionsColHeader onclick={handleHeaderClick} type={"recordedDate"} _type={sortType} sort={sortDirection} title={"Recorded Date"} alpha={false}/>
                                <PatientConditionsColHeader onclick={handleHeaderClick} type={"onsetDate"} _type={sortType} sort={sortDirection} title={"Onset Date"} alpha={false}/>
                                <PatientConditionsColHeader onclick={handleHeaderClick} type={"abatementDate"} _type={sortType} sort={sortDirection} title={"Abatement Date"} alpha={false}/>
                                <PatientConditionsColHeader onclick={handleHeaderClick} type={"clinicalStatus"} _type={sortType} sort={sortDirection} title={"Clinical Status"} alpha={true}/>
                                <PatientConditionsColHeader onclick={handleHeaderClick} type={"verificationStatus"} _type={sortType} sort={sortDirection} title={"Verification Status"} alpha={true}/>
                            </tr>
                        </thead>
                        <tbody>
                        {props.conditions.entry && props.conditions.entry.sort((a,b)=>{

                            let res = 0;

                            switch(sortType){
                                case 'condition':
                                    res = a.resource.code.text.localeCompare(b.resource.code.text)
                                    break;
                                case 'onsetDate':
                                    res = new Date(a.resource.onsetDateTime).getTime() - new Date(b.resource.onsetDateTime).getTime()
                                    break;
                                case 'recordedDate':
                                    res = new Date(a.resource.recordedDate).getTime() - new Date(b.resource.recordedDate).getTime()
                                    break;
                                case 'abatementDate':
                                    res = new Date(a.resource.abatementDateTime).getTime() - new Date(b.resource.abatementDateTime).getTime()
                                    break;
                                case 'clinicalStatus':
                                    res = a.resource.clinicalStatus.coding[0].code.localeCompare(b.resource.clinicalStatus.coding[0].code)
                                    break;
                                case 'verificationStatus':
                                    res = a.resource.verificationStatus.coding[0].code.localeCompare(b.resource.verificationStatus.coding[0].code)
                                    break;
                            }

                            return res * sortDirection;

                        }).map((condition, index) => {
                            return <tr className={"hover:bg-slate-200"} key={condition.resource.id}>
                                <td><a className={"hover:text-blue-400 text-blue-600"} href={"https://pubmed.ncbi.nlm.nih.gov/?term="+encodeURIComponent(condition.resource.code.text)} target={"_blank"} rel={"noreferrer"}>{condition.resource.code.text}</a></td>
                                <td>{new Date(condition.resource.onsetDateTime).toLocaleString()}</td>
                                <td>{new Date(condition.resource.recordedDate).toLocaleString()}</td>
                                <td>{condition.resource.abatementDateTime && new Date(condition.resource.abatementDateTime).toLocaleString()}</td>
                                <td>{condition.resource.clinicalStatus.coding[0].code}</td>
                                <td>{condition.resource.verificationStatus.coding[0].code}</td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        } </>
}

function yearsSince(start: Date, end: Date = new Date()): number {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)
}

export default PatientDetails