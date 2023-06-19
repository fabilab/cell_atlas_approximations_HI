import { Layout, Row, Breadcrumb } from 'antd';
import QuickPlotGeneratorSelection from './QuickPlotGeneratorSelection';
import Api from '../Api';

const QuickPlotGenerator = (props) => {

    return (
        <>
            <Breadcrumb
                separator=">"
                items={[
                {
                    title: 'Organisms'
                },
                {
                    title: 'Organs'
                },
                {
                    title: 'Gene group'
                }
                ]}
                style={{
                    marginLeft: "2vw",
                    margin: "10px",
                    fontSize:'1em'
                }}
            />
            <Row
                style={{marginLeft:"1vw"}}>
                {
                props.organisms && props.organisms.map((o) => (
                    <QuickPlotGeneratorSelection name={o} key={o} />
                ))
                }
            </Row>
        </>
    )
}

export default QuickPlotGenerator