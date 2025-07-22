import { useEffect, useState } from "react";
import CountryCard from "./CountryCard";
import ShimmerEffectCard from "./ShimmerEffectCard";

export default function CountryCardContainer({ filterRegion, searchName }) {
    const [countriesData, setCountriesData] = useState(null);

    let filteredCountries = countriesData;

    if (countriesData && (filterRegion || searchName)) {
        filteredCountries = countriesData.filter((country) => {
            if (filterRegion !== "") {
                return country.continents.includes(filterRegion);
            } else {
                return true;
            }
        }).filter((country) => {
            return country.name.common.toLowerCase().includes(searchName) || country.region.toLowerCase().includes(searchName);
        });
    }

    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all?fields=name,capital,cca2,cca3,cioc,flags,region,subregion,population,continents")
            .then((res) => res.json())
            .then((data) => {
                setCountriesData(data);
                localStorage.setItem("countriesData", JSON.stringify(data));
            }).catch((error) => {
                console.error(error);
            });
    }, []);

    if (filteredCountries && !filteredCountries.length) {
        return (
            <div className="text-base font-semibold text-primary dark:text-dark-text-primary lg:text-lg">
                <h2>Country not found!</h2>
            </div>
        );
    }

    return (
        <div className="grid-cols grid auto-cols-auto grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-8 px-4 sm:gap-10 sm:px-0 lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]" role="grid" aria-label="Country List">
            {
                (countriesData) ? (
                    filteredCountries.map((countryData) => (
                        <CountryCard
                            imgUrl={countryData.flags.png}
                            name={countryData.name.common}
                            population={countryData.population.toLocaleString("en-IN")}
                            region={countryData.region}
                            capital={(countryData.capital) || "No Capital"}
                            countryCodes={{
                                cca2: countryData.cca2,
                                cca3: countryData.cca3,
                                cioc: countryData.cioc
                            }}
                            key={countryData.name.common}
                        />
                    ))
                ) : (
                    Array.from({ length: 16 }).map((_, index) => (
                        <ShimmerEffectCard key={index} />
                    ))
                )
            }
        </div>
    )
}
