import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Calendar } from "lucide-react";
import { Technician } from "@/types/Index";
import { getMatches, highlightText } from "@/services/semanticSearch";

interface TechnicianCardProps {
  technician: Technician;
  searchQuery: string;
  score: number;
}

const TechnicianCard: React.FC<TechnicianCardProps> = ({ technician, searchQuery, score }) => {
  const {
    name,
    service,
    description,
    specialties,
    rating,
    reviewCount,
    location,
    imageUrl,
    availability,
  } = technician;
  
  // Get matching words to highlight
  const descriptionMatches = getMatches(description, searchQuery);
  const serviceMatches = getMatches(service, searchQuery);

  // Since specialties is stored as a string in the database,
  // force it to a string (in case TypeScript expects an array) and split it by commas.
  const specialtiesArray = specialties 
    ? (specialties as unknown as string).split(",").map((s) => s.trim())
    : [];

  // (Optional) Get matches for each specialty if needed.
  const specialtiesMatches = specialtiesArray.flatMap((specialty) =>
    getMatches(specialty, searchQuery)
  );
  
  // Create highlighted HTML (in production, use a sanitizer)
  const highlightedDescription = highlightText(description, descriptionMatches);
  const highlightedService = highlightText(service, serviceMatches);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{name}</CardTitle>
            <div className="mt-1 flex items-center">
              <span className="flex items-center text-amber-500 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(rating ?? 0) ? "currentColor" : "none"}
                    className={i < Math.floor(rating ?? 0) ? "text-amber-500" : "text-gray-300"}
                  />
                ))}
                <span className="ml-1 text-tech-dark-gray">{(rating ?? 0).toFixed(1)}</span>
              </span>
              <span className="text-sm text-tech-dark-gray">({reviewCount || 0} reviews)</span>
            </div>
          </div>
          {imageUrl ? (
            <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
              <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-tech-light-blue flex items-center justify-center text-tech-blue font-bold text-xl">
              {name.charAt(0)}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="mb-2">
          <h3 className="font-medium text-tech-blue">Service</h3>
          <p dangerouslySetInnerHTML={{ __html: highlightedService }} />
        </div>
        
        <div className="mb-2">
          <h3 className="font-medium text-tech-blue">Description</h3>
          <p 
            className="text-sm text-gray-700 line-clamp-2" 
            dangerouslySetInnerHTML={{ __html: highlightedDescription }}
          />
        </div>
        
        <div className="mb-2">
          <h3 className="font-medium text-tech-blue">Specialties</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {specialtiesArray.map((specialty, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-tech-light-teal text-tech-teal hover:bg-tech-teal hover:text-white"
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-tech-dark-gray mt-2">
          <MapPin size={14} className="mr-1" />
          <span>{location}</span>
          {availability && (
            <>
              <span className="mx-2">•</span>
              <Calendar size={14} className="mr-1" />
              <span>{availability}</span>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-gray-500">
          Match score: {(score * 100).toFixed(1)}%
        </div>
        <Button 
          className="bg-tech-teal hover:bg-teal-700 text-white"
          size="sm"
        >
          <Phone size={14} className="mr-1" />
          Contact
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TechnicianCard;
