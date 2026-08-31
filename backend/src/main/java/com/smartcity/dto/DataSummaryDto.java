package com.smartcity.dto;

import java.util.Map;

public class DataSummaryDto {
    private long totalRecords;
    private int numberOfZones;
    private String trainingPeriod;
    private String modelPeriod;
    private int numberOfFeatures;
    private long missingValueCount;
    private long duplicateCount;
    private long invalidValueCount;
    private String preprocessingStatus;
    private String dataProvenanceNote;

    public DataSummaryDto() {}

    public long getTotalRecords() { return totalRecords; }
    public void setTotalRecords(long totalRecords) { this.totalRecords = totalRecords; }

    public int getNumberOfZones() { return numberOfZones; }
    public void setNumberOfZones(int numberOfZones) { this.numberOfZones = numberOfZones; }

    public String getTrainingPeriod() { return trainingPeriod; }
    public void setTrainingPeriod(String trainingPeriod) { this.trainingPeriod = trainingPeriod; }

    public String getModelPeriod() { return modelPeriod; }
    public void setModelPeriod(String modelPeriod) { this.modelPeriod = modelPeriod; }

    public int getNumberOfFeatures() { return numberOfFeatures; }
    public void setNumberOfFeatures(int numberOfFeatures) { this.numberOfFeatures = numberOfFeatures; }

    public long getMissingValueCount() { return missingValueCount; }
    public void setMissingValueCount(long missingValueCount) { this.missingValueCount = missingValueCount; }

    public long getDuplicateCount() { return duplicateCount; }
    public void setDuplicateCount(long duplicateCount) { this.duplicateCount = duplicateCount; }

    public long getInvalidValueCount() { return invalidValueCount; }
    public void setInvalidValueCount(long invalidValueCount) { this.invalidValueCount = invalidValueCount; }

    public String getPreprocessingStatus() { return preprocessingStatus; }
    public void setPreprocessingStatus(String preprocessingStatus) { this.preprocessingStatus = preprocessingStatus; }

    public String getDataProvenanceNote() { return dataProvenanceNote; }
    public void setDataProvenanceNote(String dataProvenanceNote) { this.dataProvenanceNote = dataProvenanceNote; }
}
