import { useFormik } from "formik";
import * as Yup from "yup";

function CreateHike({ onAddHike }) {
    const formik = useFormik({
        initialValues: {
            name: "",
            city: "",
            state: "",
            length: "",
            difficulty: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
            city: Yup.string().required("Required"),
            state: Yup.string().required("Required"),
            length: Yup.number()
                .required("Required")
                .positive("Must be positive")
                .typeError("Must be a number"),
            difficulty: Yup.number()
                .required("Required")
                .min(1, "Min difficulty is 1")
                .max(5, "Max difficulty is 5")
                .typeError("Must be a number"),
        }),
        onSubmit: (values, {resetForm}) => {
            fetch("http://localhost:3000/hikes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
        })
        .then((r) => r.json())
        .then((newHike) => {
          onAddHike(newHike);
          resetForm(); 
        });
    },
    })

    return (
        <>
        <main>
            <h1>Fill out the form below, to add your hike to the hikes page!</h1>


        <form onSubmit={formik.handleSubmit}>
            <div>
                <label for="hikename">hike name: </label>
                <input id="hikename" type="text" name="name" value={formik.values.name} onChange={formik.handleChange} placeholder="hikename" />
            </div>
            <br/>
            <div>
                <label for="hikecity">hike city: </label>
                <input id="hikecity" type="text" name="city" value={formik.values.city} onChange={formik.handleChange} placeholder="hikecity" />
            </div>
            <br/>
            <div>
                <label for="hikestate">hike state: </label>
                <input id="hikestate" type="text" name="state" value={formik.values.state} onChange={formik.handleChange} placeholder="hikestate" />
            </div>
            <br/>
            <br/>
            <div>
                <label for="hikedifficulty">hike difficulty: </label>
                <input id="hikedifficulty" type="number" name="difficulty" value={formik.values.difficulty} onChange={formik.handleChange} placeholder="hikedifficulty" />
            </div>
            <br/>
            <br/>
            <div>
                <label for="hikelength">hike length: </label>
                <input id="hikelength" type="number" name="length" value={formik.values.length} onChange={formik.handleChange} placeholder="hikelength" />
            </div>
            <br/>
            <button type="submit">Submit</button>
            </form>

        </main>
        </>
    )
}
export default CreateHike