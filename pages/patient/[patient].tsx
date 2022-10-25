import {GetServerSideProps, NextPage} from "next";
import {useRouter} from "next/router";
import PatientDetails, {ConditionsResult} from "../../components/patient-details";
import {PatientResult} from "../index";
import {PatientModel} from "../../components/patients";

const Patient: NextPage<{ patient: PatientModel,
    conditions: ConditionsResult
}> = (props) => {

    const router = useRouter();

    const refreshData = () => {
        router.replace(router.asPath);
    }

    return (
        <div className={"container mx-auto"}>
            <PatientDetails patient={props.patient} conditions={props.conditions}/>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({params, res}) => {
    try {
        if(!params||!params.patient){
            res.statusCode = 404;
            return {
                props: {}
            };
        }else{
            const patientResult = await fetch(`https://r4.smarthealthit.org/Patient/${params!.patient}?_format=json`);
            const patientData: PatientModel = await patientResult.json();
            const conditionsResult = await fetch(`https://r4.smarthealthit.org/Condition/_search?patient=${params!.patient}&_format=json`);
            const conditionsData: ConditionsResult = await conditionsResult.json();
            return {
                props: {
                    patient: patientData,
                    conditions: conditionsData
                }
            };
        }
    } catch {
        res.statusCode = 404;
        return {
            props: {}
        };
    }
};

export default Patient