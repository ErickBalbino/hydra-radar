export default function normalizeAlertRuleType(ruleType: string) {
    switch (ruleType) {
        case "greater_than":
            return "Maior que"
        case "less_than":
            return "Menor que"
        default:
            return ""
    }
}