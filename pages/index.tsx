import type {GetServerSideProps, NextPage} from 'next'
import Patients, {PatientModel} from "../components/patients";
import {useRouter} from "next/router";

export interface PatientResult {
    fullUrl: string,
    resource: PatientModel,
    search: {
        mode: string
    },
    response: {
        status: string,
        etag: string
    }
}

export interface PatientsResult {
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
    entry: Array<PatientResult>,
    search: {
        mode: string
    },
    response: {
        status: string,
        etag: string
    }
}

const Home: NextPage<{ data: PatientsResult }> = (props) => {

    const router = useRouter();

    const refreshData = () => {
        router.replace(router.asPath);
    }

    return (
        <div className={"vw-100"}>
            <Patients patients={props.data}/>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({params, res}) => {
    try {
        //TODO: Implement searching. This route returns different data each time.
        const result = await fetch(`https://r4.smarthealthit.org/Patient?_format=json`);
        const data: PatientsResult = await result.json();
        return {
            props: {data}
        };
    } catch {
        res.statusCode = 404;
        return {
            props: {}
        };
    }
};

export default Home
