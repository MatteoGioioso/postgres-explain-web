import React, {useState} from 'react'
import '@cloudscape-design/global-styles/index.css'
import Textarea from '@cloudscape-design/components/textarea'
import {
    AppLayout, Box,
    Button,
    ContentLayout,
    ExpandableSection,
    Header,
    SpaceBetween,
} from '@cloudscape-design/components'
import {SummaryTable, SummaryDiagram, PlanService} from 'postgres-explain'
import {MainInfo} from './Info'
import {ErrorAlert} from './ErrorReporting'


const QUERY_PLAN_EXAMPLE_PLACEHOLDER = `[
  {
    "Plan": {
      "Node Type": "Seq Scan",
      "Parallel Aware": false,
      "Relation Name": "people",
      "Alias": "people",
      "Filter": "((first_name)::text = 'Alice'::text)",
      "Startup Cost": 0.00,
      "Total Cost": 16.49,
      "Plan Rows": 2,
      "Plan Width": 1032,
      "Actual Startup Time": 0.099,
      "Actual Total Time": 0.357,
      "Actual Rows": 2,
      "Actual Loops": 1,
      "Rows Removed by Filter": 2684
    },
    "Planning Time": 0.108,    
    "Execution Time": 0.381,
    "Triggers": []
  }
]`


const planService = new PlanService();

const Form = () => {
    function onClick(queryPlan) {
        if (!queryPlan) return

        const plan = planService.fromSource(queryPlan);

        try {
            // eslint-disable-next-line
            const go = new Go()

            WebAssembly.instantiateStreaming(fetch('/main.wasm'), go.importObject).then(res => {
                go.run(res.instance)
                const out = global.explain(plan)

                console.log(out)

                if (out.error) {
                    console.error(`${out.error}: ${out.error_details}`)

                    setError({
                        message: out.error,
                        error_details: out.error_details,
                        stackTrace: out.error_stack,
                    })
                } else {
                    setExplained(JSON.parse(out.explained))
                }
            })

        } catch (e) {
            setError({
                message: e.message,
            })
        }
    }

    const [queryPlan, setQueryPlan] = useState('')
    const [explained, setExplained] = useState({})
    const [error, setError] = useState()

    return (
        <AppLayout
            content={
                <ContentLayout
                    header={
                        <Header
                            variant="awsui-h1-sticky"
                            description="(alpha version)"
                        >
                            Postgres explain
                        </Header>
                    }
                >
                    <SpaceBetween size="xl">
                        {
                            Object.keys(explained).length === 0 ? (
                                <>
                                    <Textarea
                                        onChange={({detail}) => setQueryPlan(detail.value)}
                                        value={queryPlan}
                                        rows={QUERY_PLAN_EXAMPLE_PLACEHOLDER.split('\n').length}
                                        placeholder={QUERY_PLAN_EXAMPLE_PLACEHOLDER}
                                    />
                                    <Button variant="normal" onClick={() => onClick(queryPlan)}>Explain</Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="normal"
                                        onClick={() => {
                                            setExplained({})
                                            setQueryPlan('')
                                        }}
                                    >
                                        New explain
                                    </Button>

                                    <Header variant="h2">Diagram</Header>
                                    <SummaryDiagram summary={explained.summary} stats={explained.stats}/>

                                    <Header variant="h2">Summary</Header>
                                    <SummaryTable
                                        summary={explained.summary}
                                        stats={explained.stats}
                                    />

                                </>

                            )
                        }

                    </SpaceBetween>

                </ContentLayout>
            }
            tools={
                <MainInfo/>
            }
            notifications={error && <ErrorAlert error={error} onDismiss={() => setError()}/>}
            navigationHide
        />

    )
}

export default Form
