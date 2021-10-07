import React from "react";
import {Table} from "react-bootstrap";
import {t} from "../../misc/misc";

export const PackTableForeignProducts: React.FC<{ approvedForeignProducts: string[] | undefined }> = ({approvedForeignProducts}) => {
    return <Table striped bordered hover size={"sm"}>
        <thead>
        <tr>
            <th>{t("Foreign Products")}</th>
        </tr>
        </thead>
        <tbody>
        {approvedForeignProducts && approvedForeignProducts.map(foreignProduct => <tr>
            <td>{foreignProduct}</td>
        </tr>)}
        </tbody>
    </Table>

}
