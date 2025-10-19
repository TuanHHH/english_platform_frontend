"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function PaymentMethods({ selected, onSelect }) {
  const paymentMethods = [
    {
      id: "momo",
      name: "MoMo",
      description: "Thanh toán qua ví điện tử MoMo",
      logo: "/momo.png",
      bg: "bg-pink-50 border-pink-200",
    },
    {
      id: "vnpay",
      name: "VNPay",
      description: "Thanh toán qua cổng VNPay",
      logo: "/vnpay.png",
      bg: "bg-blue-50 border-blue-200",
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Thanh toán bằng thẻ quốc tế",
      logo: "/stripe.png",
      bg: "bg-indigo-50 border-indigo-200",
    },
  ]

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Phương thức thanh toán</h3>

      <RadioGroup value={selected} onValueChange={onSelect}>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="relative">
              <RadioGroupItem
                value={method.id}
                id={method.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={method.id}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 border-border cursor-pointer transition-all hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5`}
              >
                <div
                  className={`w-14 h-14 rounded-lg flex items-center justify-center ${method.bg}`}
                >
                  <Image
                    src={method.logo}
                    alt={method.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{method.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {method.description}
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </Card>
  )
}
