
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export const BuyingPowerCalculator = () => {
  const [loanAmount, setLoanAmount] = useState([7200000]);

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-orange-200 to-amber-300">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          KNOW YOUR BUYING POWER ?
        </h2>
        
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Car Image */}
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Luxury Car"
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
            </div>
            
            {/* Calculator Form */}
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-orange-600">
                  RS. {loanAmount[0].toLocaleString()}/=
                </h3>
                <p className="text-gray-600">Maximum Loan Amount</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LOAN TYPE
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal Loan</SelectItem>
                      <SelectItem value="auto">Auto Loan</SelectItem>
                      <SelectItem value="lease">Lease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    INCOME /MONTH
                  </label>
                  <Input placeholder="Monthly income" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LOAN TERM
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Years</SelectItem>
                      <SelectItem value="5">5 Years</SelectItem>
                      <SelectItem value="7">7 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    INTEREST RATE
                  </label>
                  <Input placeholder="Rate %" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  LOAN AMOUNT
                </label>
                <Slider
                  value={loanAmount}
                  onValueChange={setLoanAmount}
                  max={10000000}
                  min={100000}
                  step={100000}
                  className="w-full"
                />
              </div>
              
              <Button className="w-full bg-orange-600 hover:bg-orange-700 py-3">
                Calculate Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
