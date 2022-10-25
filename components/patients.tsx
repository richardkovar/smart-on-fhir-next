import Patient from "./patient";
import {PatientResult, PatientsResult} from "../pages";

//TODO: Refactor to better reflect FHIR types. This model has many repetitions and can be improved.

export interface PatientModel {
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
    text: {
        status: string,
        div: string,
    },
    extension: Array<{
        url: string,
        extension?: Array<{
            url: string,
            valueCoding?: {
                system: string,
                coe: string,
                display: string
            },
            valueString?: string
        }>,
        valueString?: string,
        valueCode?: string,
        valueAddress?: {
            city: string,
            state: string,
            country: string
        },
        valueDecimal?: number
    }>,
    identifier: Array<{
        type?: {
            coding: Array<{
                system: string,
                code: string,
                display: string,
            }>,
            text: string
        },
        system: string,
        value: string,
    }>,
    name: Array<{
        use: string,
        family: string,
        given: Array<string>,
        prefix: Array<string>
    }>,
    telecom: Array<{
        system: string,
        value: string,
        use: string,
    }>,
    gender: string,
    birthDate: string,
    deceasedDateTime: string,
    address: Array<{
        extension: Array<{
            url: string,
            extension: Array<{
                url: string,
                valueDecimal: string
            }>
        }>,
        line: Array<string>,
        city: string,
        state: string,
        postalCode: string,
        country: string,
    }>,
    maritalStatus: Array<{
        coding: Array<{
            system: string,
            code: string,
            display: string,
        }>,
        text: string
    }>,
    multipleBirthBoolean: boolean,
    communication: Array<{
        language: {
            coding: Array<{
                system: string,
                code: string,
                display: string,
            }>,
            text: string
        }
    }>
}

function Patients(props: {patients: PatientsResult}) {
    return <div className={"relative h-screen w-full"}>
        <div className={"absolute max-w-5xl grid gap-1 grid-cols-5 relative top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"}>{ props.patients.entry &&
            props.patients.entry.sort((a,b)=>{
                return a.resource.name[0].family.localeCompare(b.resource.name[0].family)
            }).map((patient:PatientResult)=>{
                return <Patient key={patient.fullUrl} patient={patient.resource}></Patient>;
            })
        }</div>
    </div>
}

export default Patients