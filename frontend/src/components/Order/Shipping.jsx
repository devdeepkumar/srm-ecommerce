import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";
import CheckoutPath from "../CheckoutPath";
import { saveShippingInfo } from "../../features/cart/cartSlice";

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    houseNo: "",
    landMark: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    countryCode: "",
    stateCode: "",
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/user/login?redirect=/shipping");
    }
  }, [isAuthenticated, navigate]);

  const handleCountryChange = (e) => {
    const isoCode = e.target.value;
    const selectedCountry = Country.getCountryByCode(isoCode);

    setForm((prev) => ({
      ...prev,
      country: selectedCountry?.name || "",
      countryCode: isoCode,
      state: "",
      stateCode: "",
      city: "",
    }));

    const fetchedStates = State.getStatesOfCountry(isoCode);
    setStates(fetchedStates);
    setCities([]);
  };

  const handleStateChange = (e) => {
    const isoCode = e.target.value;
    const selectedState = states.find((s) => s.isoCode === isoCode);

    setForm((prev) => ({
      ...prev,
      state: selectedState?.name || "",
      stateCode: isoCode,
      city: "",
    }));

    const fetchedCities = City.getCitiesOfState(form.countryCode, isoCode);
    setCities(fetchedCities);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, phone, address, city, state, postalCode, country } = form;

    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be 10 digits only");
      return;
    }

    if (!/^\d{6}$/.test(postalCode)) {
      toast.error("Postal code must be 6 digits only");
      return;
    }

    dispatch(saveShippingInfo(form));
    toast.success("Shipping details saved");
    navigate("/order/confirmation");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[75vh]">
      <CheckoutPath currentStep={0} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-6 sm:p-10 mt-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Shipping Address
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-8">
          Please enter the delivery address where your order will be delivered.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="e.g. John Doe"
                value={form.fullName}
                onChange={handleChange}
                className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={(e) => {
                  if (/^\d{0,10}$/.test(e.target.value)) {
                    handleChange(e);
                  }
                }}
                maxLength="10"
                className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Flat, House No., Building (Optional)
              </label>
              <input
                type="text"
                name="houseNo"
                placeholder="e.g. Flat 402, Green Valley"
                value={form.houseNo}
                onChange={handleChange}
                className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Landmark (Optional)
              </label>
              <input
                type="text"
                name="landMark"
                placeholder="e.g. Near City Park"
                value={form.landMark}
                onChange={handleChange}
                className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                placeholder="e.g. 12th Main, Indiranagar"
                value={form.address}
                onChange={handleChange}
                className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Country <span className="text-rose-500">*</span>
              </label>
              <select
                name="country"
                value={form.countryCode}
                onChange={handleCountryChange}
                className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              >
                <option value="">Select Country</option>
                <option value="IN">India</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                State <span className="text-rose-500">*</span>
              </label>
              <select
                name="state"
                value={form.stateCode}
                onChange={handleStateChange}
                disabled={!states.length}
                className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition disabled:opacity-50"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                City <span className="text-rose-500">*</span>
              </label>
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                disabled={!cities.length}
                className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition disabled:opacity-50"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Postal Code (PIN) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="postalCode"
                placeholder="6-digit PIN code"
                value={form.postalCode}
                onChange={(e) => {
                  if (/^\d{0,6}$/.test(e.target.value)) {
                    handleChange(e);
                  }
                }}
                maxLength="6"
                className="w-full bg-gray-50 focus:bg-white border border-gray-200 focus:border-amber-500 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs sm:text-sm tracking-wider uppercase py-4 rounded-xl transition shadow-md hover:shadow-lg cursor-pointer"
            >
              Save & Continue to Order Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
