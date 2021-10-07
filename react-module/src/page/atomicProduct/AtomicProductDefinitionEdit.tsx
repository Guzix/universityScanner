import React from "react";
import {Button, Form} from "react-bootstrap";
import {AtomicProductDefinition} from "../../openapi/models";
import {FormControlComponent} from "../../CommonComponent";

export const AtomicProductTypeEditOld: React.FC<{}> = () => {
    const [atomicProductType, setAtomicProductType] = React.useState<AtomicProductDefinition>({
        title: "default",
        parent: undefined
    });
    return <div>
        <h2>AtomicProductDefinitionEdit</h2>
        <Form onSubmit={(e) => {
            e.preventDefault();
            console.log(e)
        }}>
            <Form.Group className="mb-3" controlId="name">
                <Form.Label>Title</Form.Label>
                <FormControlComponent name={"title"} object={atomicProductType} setObject={setAtomicProductType}/>
                <Form.Text className="text-muted">
                    Title of AtomicProductType
                </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    </div>
}