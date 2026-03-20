import { useParams } from "react-router-dom";

export default function MovieDetail() {
    const { id } = useParams();

    return <div>Movie ID: {id}</div>;
}