package main

import (
	"encoding/json"
	"fmt"
	"github.com/MatteoGioioso/postgres-explain/pkg"
	"runtime/debug"
	"syscall/js"
)

func main() {
	fmt.Println("Starting explain WASM")
	js.Global().Set("explain", explain())
	<-make(chan bool)
}

func explain() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) (ret any) {
		defer func() {
			if r := recover(); r != nil {
				ret = map[string]any{
					"error":         "query explain panic",
					"error_details": fmt.Errorf("%s", r).Error(),
					"error_stack":   string(debug.Stack()),
				}
			}
		}()

		if len(args) != 1 {
			return map[string]any{
				"error": "invalid no of arguments passed",
			}
		}

		plans := args[0].String()
		node, err := pkg.GetRootNodeFromPlans(plans)
		if err != nil {
			return map[string]any{
				"error":         "invalid input: the plan was probably not valid JSON or text",
				"error_details": err.Error(),
			}
		}

		layout := pkg.NewLayout()
		layout.PrintTreeHorizontal(node)

		stats, err := pkg.GetStatsFromPlans(plans)
		if err != nil {
			return map[string]any{
				"error":         "could not get stats from plan",
				"error_details": err.Error(),
			}
		}
		pkg.NewPlanEnricher().AnalyzePlan(node, &stats)

		summary := pkg.NewSummary().Do(node, stats)

		explained := pkg.Explained{
			Summary: summary,
			Stats:   stats,
		}

		marshalledExplained, err := json.Marshal(explained)
		if err != nil {
			return map[string]any{
				"error":         "could not marshal enriched plan",
				"error_details": err.Error(),
			}
		}

		return map[string]any{
			"explained": string(marshalledExplained),
			"error":     nil,
		}
	})
}
