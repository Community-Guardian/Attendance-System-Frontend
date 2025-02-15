import { toast } from "@/hooks/use-toast"

export const handleFormError = (error: any) => {
  if (error instanceof Error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    })
  } else if (typeof error === "object" && error !== null) {
    const errorFields = [
      "contact_number",
      "next_of_kin",
      "full_name",
      "id_number",
      "kra_pin",
      "date_of_birth",
      "marital_status",
      "gender",
      "identity_type",
      "employment_status",
      "country",
      "county",
      "town",
    ]

    for (const field of errorFields) {
      if (error[field] && error[field][0]) {
        toast({
          title:
            field === "next_of_kin"
              ? "Next Of Kin Phone Number"
              : field.replace("_", " ").charAt(0).toUpperCase() + field.slice(1),
          description: field === "next_of_kin" ? error[field][0].contact_number[0] : error[field][0],
          variant: "destructive",
        })
        return
      }
    }
  }

  toast({
    title: "Error",
    description: "Something went wrong",
    variant: "destructive",
  })
}

