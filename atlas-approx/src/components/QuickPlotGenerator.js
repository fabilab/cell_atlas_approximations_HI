import { Layout, Row, Breadcrumb } from 'antd';
import QuickPlotGeneratorSelection from './QuickPlotGeneratorSelection';
import Api from '../Api';

const QuickPlotGenerator = () => {

    // async function fetchData () {
    //     if (!avgExpression) {
    //         const api = new Api();
    //         const result = await api.getOrganisms();
    //         setAvgExpression(result); // avgExpression = result
    //     }
    // }
    // fetchData();

    return (
        <>
            <Breadcrumb
                separator=">"
                items={[
                {
                    title: 'Homo Sapien'
                },
                {
                    title: 'Lung'
                },
                {
                    title: 'Respiratory Genes'
                }
                ]}
                style={{
                    marginLeft: "20px",
                    fontSize:'1.25em'
                }}
            />
            <Row>
                {
                  Array('Human', 'Mouse', 'Bird', 'Horse', 'Cat', 'Dog', 'Fish').map(a => (
                    <QuickPlotGeneratorSelection
                        name={a}
                    />
                  ))
                }
            </Row>
        </>
    )
}

export default QuickPlotGenerator