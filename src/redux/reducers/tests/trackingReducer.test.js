import {trackingSlice,
    fetchDaysTrackingRequest,
    fetchDaysTrackingSuccess,
    fetchDaysTrackingFailure,
    createSymptomTrackingRecordRequest,
    createSymptomTrackingRecordSuccess,
    createSymptomTrackingRecordFailure,
    editSymptomTrackingRecordRequest,
    editSymptomTrackingRecordSuccess,
    editSymptomTrackingRecordFailure,
    deleteSymptomTrackingRecordRequest,
    deleteSymptomTrackingRecordSuccess,
    deleteSymptomTrackingRecordFailure,
    createMedTrackingRecordRequest,
    createMedTrackingRecordSuccess,
    createMedTrackingRecordFailure,
    editMedTrackingRecordRequest,
    editMedTrackingRecordSuccess,
    editMedTrackingRecordFailure,
    deleteMedTrackingRecordRequest,
    deleteMedTrackingRecordSuccess,
    deleteMedTrackingRecordFailure,
    connectSymptomRequestTracking,
    connectSymptomSuccessTracking,
    connectSymptomFailureTracking,
    changeSymptomRequestTracking,
    changeSymptomSuccessTracking,
    changeSymptomFailureTracking,
    disconnectFromSymptomRequestTracking,
    disconnectFromSymptomSuccessTracking,
    disconnectFromSymptomFailureTracking,
    connectMedRequestTracking,
    connectMedSuccessTracking,
    connectMedFailureTracking,
    changeMedRequestTracking,
    changeMedSuccessTracking,
    changeMedFailureTracking,
    disconnectFromMedRequestTracking,
    disconnectFromMedSuccessTracking,
    disconnectFromMedFailureTracking,
    logout
} from '../trackingReducer';
import {describe, it, expect} from 'vitest';

describe('fetchDaysTracking', () => {
    it('should handle fetchDaysTrackingRequest', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {},
                medications: {}
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        }
        const action = fetchDaysTrackingRequest();
        const expectedState = {            
            primaryTracking: {
                symptoms: {},
                medications: {}
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: true,
            error: null,
            history: {}};
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle fetchDaysTrackingSuccess', () => {
        const initialState = {            
            primaryTracking: {
                symptoms: {},
                medications: {}
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: true,
            error: null,
            history: {}
        };
        const action = fetchDaysTrackingSuccess({
            slice: 'primaryTracking',
            symptomTrackingData: {
                S1: {
                    '12-4 AM': 3,
                    '8 AM-12 PM': 2,
                    '12-4 PM': 1
                }
            },
            medTrackingData: {
                AM: {
                    M1: 2
                },
                Midday: {},
                PM: {
                    M1: 1
                },
                Evening: {}
            }
        });
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle fetchDaysTrackingFailure', () => {       
        const initialState = {            
            primaryTracking: {
                symptoms: {},
                medications: {}
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: true,
            error: null,
            history: {}
        };
        const action = fetchDaysTrackingFailure('no such user exists');
        const expectedState = {
            primaryTracking: {
                symptoms: {},
                medications: {}
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: 'no such user exists',
            history: {}
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('createSymptomTrackingRecord', () => {
    it('should handle createSymptomTrackingRecordRequest', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        }
        const action = createSymptomTrackingRecordRequest({
            slice: 'primaryTracking',
            symptom: 'S1', 
            timespan: '4-8 PM',
            severity: 4
        });
        const expectedState = {            
            ...initialState,
            loading: true,
            error: null,
            history: {
                S1: {
                    '12-4 AM': 3,
                    '8 AM-12 PM': 2,
                    '12-4 PM': 1
                }
            },
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1,
                        '4-8 PM': 4
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle createSymptomTrackingRecordSuccess', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1,
                        '4-8 PM': 4
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: true,
            error: null,
            history: {
                S1: {
                    '12-4 AM': 3,
                    '8 AM-12 PM': 2,
                    '12-4 PM': 1
                }
            },
        }
        const action = createSymptomTrackingRecordSuccess();
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1,
                        '4-8 PM': 4
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle createSymptomTrackingRecordFailure', () => {       
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1,
                        '4-8 PM': 4
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: true,
            error: null,
            history: {
                S1: {
                    '12-4 AM': 3,
                    '8 AM-12 PM': 2,
                    '12-4 PM': 1
                }
            },
        }
        const action = createSymptomTrackingRecordFailure({
            dataForStore: {
                slice: 'primaryTracking',
            },
            error: 'no such user symptom exists'});
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: 'no such user symptom exists',
            history: {}
        }
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('editSymptomTrackingRecord', () => {
    it('should handle editSymptomTrackingRecordRequest', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        }
        const action = editSymptomTrackingRecordRequest({
            slice: 'primaryTracking',
            symptom: 'S1', 
            timespan: '12-4 AM',
            severity: 1
        });
        const expectedState = {            
            ...initialState,
            loading: true,
            error: null,
            history: {
                S1: {
                    '12-4 AM': 3,
                    '8 AM-12 PM': 2,
                    '12-4 PM': 1
                }
            },
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 1,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1,
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle editSymptomTrackingRecordSuccess', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 1,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1,
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: true,
            error: null,
            history: {
                S1: {
                    '12-4 AM': 3,
                    '8 AM-12 PM': 2,
                    '12-4 PM': 1
                }
            },
        }
        const action = editSymptomTrackingRecordSuccess();
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 1,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1,
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle editSymptomTrackingRecordFailure', () => {       
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 1,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1,
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: true,
            error: null,
            history: {
                S1: {
                    '12-4 AM': 3,
                    '8 AM-12 PM': 2,
                    '12-4 PM': 1
                }
            },
        }
        const action = editSymptomTrackingRecordFailure({
            dataForStore: {
                slice: 'primaryTracking',
            },
            error: 'no such tracking record exists'});
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: 'no such tracking record exists',
            history: {}
        }
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('deleteSymptomTrackingRecord', () => {
    it('should handle deleteSymptomTrackingRecordRequest', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        }
        const action = deleteSymptomTrackingRecordRequest({
            slice: 'primaryTracking',
            symptom: 'S1', 
            timespan: '12-4 AM'
        });
        const expectedState = {            
            ...initialState,
            loading: true,
            error: null,
            history: {
                S1: {
                    '12-4 AM': 3,
                    '8 AM-12 PM': 2,
                    '12-4 PM': 1
                }
            },
            primaryTracking: {
                symptoms: {
                    S1: {
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1,
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle deleteSymptomTrackingRecordSuccess', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1,
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: true,
            error: null,
            history: {
                S1: {
                    '12-4 AM': 3,
                    '8 AM-12 PM': 2,
                    '12-4 PM': 1
                }
            },
        }
        const action = deleteSymptomTrackingRecordSuccess();
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1,
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle deleteSymptomTrackingRecordFailure', () => {       
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1,
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: true,
            error: null,
            history: {
                S1: {
                    '12-4 AM': 3,
                    '8 AM-12 PM': 2,
                    '12-4 PM': 1
                }
            },
        }
        const action = deleteSymptomTrackingRecordFailure({
            dataForStore: {
                slice: 'primaryTracking',
            },
            error: 'no such tracking record exists'});
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: 'no such tracking record exists',
            history: {}
        }
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('createMedTrackingRecord', () => {
    it('should handle createMedTrackingRecordRequest', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        }
        const action = createMedTrackingRecordRequest({
            slice: 'primaryTracking',
            timeOfDay: 'Evening',
            med: 'M1',
            number: 2
        });
        const expectedState = {            
            ...initialState,
            loading: true,
            error: null,
            history: {
                AM: {
                    M1: 2
                },
                Midday: {},
                PM: {
                    M1: 1
                },
                Evening: {}
            },
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {
                        M1: 2 
                    }
                }
            },
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle createMedTrackingRecordSuccess', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {
                        M1: 2
                    }
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: true,
            error: null,
            history: {
                AM: {
                    M1: 2
                },
                Midday: {},
                PM: {
                    M1: 1
                },
                Evening: {}
            },
        }
        const action = createMedTrackingRecordSuccess();
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {
                        M1: 2
                    }
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle createMedTrackingRecordFailure', () => {       
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {
                        M1: 2
                    }
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: true,
            error: null,
            history: {
                AM: {
                    M1: 2
                },
                Midday: {},
                PM: {
                    M1: 1
                },
                Evening: {}
            },
        }
        const action = createMedTrackingRecordFailure({
            dataForStore: {
                slice: 'primaryTracking',
            },
            error: 'no such user medication exists'});
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: 'no such user medication exists',
            history: {}
        }
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('editMedTrackingRecord', () => {
    it('should handle editMedTrackingRecordRequest', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        }
        const action = editMedTrackingRecordRequest({
            slice: 'primaryTracking',
            timeOfDay: 'AM',
            med: 'M1',
            number: 3
        });
        const expectedState = {            
            ...initialState,
            loading: true,
            error: null,
            history: {
                AM: {
                    M1: 2
                },
                Midday: {},
                PM: {
                    M1: 1
                },
                Evening: {}
            },
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 3
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {
                    }
                }
            },
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle editMedTrackingRecordSuccess', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 3
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {
                    }
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: true,
            error: null,
            history: {
                AM: {
                    M1: 2
                },
                Midday: {},
                PM: {
                    M1: 1
                },
                Evening: {}
            },
        }
        const action = editMedTrackingRecordSuccess();
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 3
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {
                    }
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle editMedTrackingRecordFailure', () => {       
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 3
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {
                    }
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: true,
            error: null,
            history: {
                AM: {
                    M1: 2
                },
                Midday: {},
                PM: {
                    M1: 1
                },
                Evening: {}
            },
        }
        const action = editMedTrackingRecordFailure({
            dataForStore: {
                slice: 'primaryTracking',
            },
            error: 'no such user medication exists'});
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: 'no such user medication exists',
            history: {}
        }
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('deleteMedTrackingRecord', () => {
    it('should handle deleteMedTrackingRecordRequest', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        }
        const action = deleteMedTrackingRecordRequest({
            slice: 'primaryTracking',
            timeOfDay: 'AM',
            med: 'M1'        });
        const expectedState = {            
            ...initialState,
            loading: true,
            error: null,
            history: {
                AM: {
                    M1: 2
                },
                Midday: {},
                PM: {
                    M1: 1
                },
                Evening: {}
            },
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {
                    }
                }
            },
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle deleteMedTrackingRecordSuccess', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {
                    }
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: true,
            error: null,
            history: {
                AM: {
                    M1: 2
                },
                Midday: {},
                PM: {
                    M1: 1
                },
                Evening: {}
            },
        }
        const action = deleteMedTrackingRecordSuccess();
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {
                    }
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: null,
            history: {}
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle deleteMedTrackingRecordFailure', () => {       
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {
                    }
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: true,
            error: null,
            history: {
                AM: {
                    M1: 2
                },
                Midday: {},
                PM: {
                    M1: 1
                },
                Evening: {}
            },
        }
        const action = deleteMedTrackingRecordFailure({
            dataForStore: {
                slice: 'primaryTracking',
            },
            error: 'no such user medication exists'});
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {}
            },
            loading: false,
            error: 'no such user medication exists',
            history: {}
        }
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('connectSymptomTracking', () => {
    it('should handle connectSymptomRequestTracking', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: null,
            history: {}
        }
        const action = connectSymptomRequestTracking({
            symptom: 'fatigue'      
        });
        const expectedState = {            
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    },
                    fatigue: {}
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {},
                    fatigue: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                secondaryTracking: {
                    S1: {}
                }
            }
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle connectSymptomSuccessTracking', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    },
                    fatigue: {}
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {},
                    fatigue: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                secondaryTracking: {
                    S1: {}
                }
            }
        }
        const action = connectSymptomSuccessTracking();
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    },
                    fatigue: {}
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {},
                    fatigue: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: null,
            history: {}
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle connectSymptomFailureTracking', () => {       
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    },
                    fatigue: {}
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {},
                    fatigue: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                secondaryTracking: {
                    S1: {}
                }
            }
        }
        const action = connectSymptomFailureTracking('no such user medication exists');
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: 'no such user medication exists',
            history: {}
        }
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('changeSymptomTracking', () => {
    it('should handle changeSymptomRequestTracking', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: null,
            history: {}
        }
        const action = changeSymptomRequestTracking({
            oldSymptom: 'S1',
            newSymptom: 'pain'      
        });
        const expectedState = {            
            primaryTracking: {
                symptoms: {
                    pain: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    pain: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                secondaryTracking: {
                    S1: {}
                }
            }
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle changeSymptomSuccessTracking', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    pain: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    pain: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                secondaryTracking: {
                    S1: {}
                }
            }
        }
        const action = changeSymptomSuccessTracking();
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    pain: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    pain: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: null,
            history: {}
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle changeSymptomFailureTracking', () => {       
        const initialState = {
            primaryTracking: {
                symptoms: {
                    pain: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    pain: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                secondaryTracking: {
                    S1: {}
                }
            }
        }
        const action = changeSymptomFailureTracking('no such user medication exists');
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: 'no such user medication exists',
            history: {}
        }
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('disconnectFromSymptomTracking', () => {
    it('should handle disconnectFromSymptomRequestTracking', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: null,
            history: {}
        }
        const action = disconnectFromSymptomRequestTracking({
            symptom: 'S1'     
        });
        const expectedState = {            
            primaryTracking: {
                symptoms: {},
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                secondaryTracking: {
                    S1: {}
                }
            }
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle disconnectFromSymptomSuccessTracking', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {},
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                secondaryTracking: {
                    S1: {}
                }
            }
        }
        const action = disconnectFromSymptomSuccessTracking();
        const expectedState = {
            primaryTracking: {
                symptoms: {},
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: null,
            history: {}
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle disconnectFromSymptomFailureTracking', () => {       
        const initialState = {
            primaryTracking: {
                symptoms: {},
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {},
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                secondaryTracking: {
                    S1: {}
                }
            }
        }
        const action = disconnectFromSymptomFailureTracking('no such user medication exists');
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: 'no such user medication exists',
            history: {}
        }
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('connectMedTracking', () => {
    it('should handle connectMedRequestTracking', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: null,
            history: {}
        }
        const action = connectMedRequestTracking({
            medication: 'tylenol',
            timeOfDay: ['AM', 'Midday', 'PM', 'Evening']   
        });
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2,
                        tylenol: null
                    },
                    Midday: {
                        tylenol: null
                    },
                    PM: {
                        M1: 1,
                        tylenol: null
                    },
                    Evening: {
                        tylenol: null
                    }
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null,
                        tylenol: null
                    },
                    Midday: {
                        tylenol: null
                    },
                    PM: {
                        M1: null,
                        tylenol: null
                    },
                    Evening: {
                        tylenol: null
                    }
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                },
                secondaryTracking: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            }
        }
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle connectMedSuccessTracking', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2,
                        tylenol: null
                    },
                    Midday: {
                        tylenol: null
                    },
                    PM: {
                        M1: 1,
                        tylenol: null
                    },
                    Evening: {
                        tylenol: null
                    }
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null,
                        tylenol: null
                    },
                    Midday: {
                        tylenol: null
                    },
                    PM: {
                        M1: null,
                        tylenol: null
                    },
                    Evening: {
                        tylenol: null
                    }
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                },
                secondaryTracking: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            }
        }
        const action = connectMedSuccessTracking();
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2,
                        tylenol: null
                    },
                    Midday: {
                        tylenol: null
                    },
                    PM: {
                        M1: 1,
                        tylenol: null
                    },
                    Evening: {
                        tylenol: null
                    }
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null,
                        tylenol: null
                    },
                    Midday: {
                        tylenol: null
                    },
                    PM: {
                        M1: null,
                        tylenol: null
                    },
                    Evening: {
                        tylenol: null
                    }
                }
            },
            loading: false,
            error: null,
            history: {}
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle connectMedSymptomFailureTracking', () => {       
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2,
                        tylenol: null
                    },
                    Midday: {
                        tylenol: null
                    },
                    PM: {
                        M1: 1,
                        tylenol: null
                    },
                    Evening: {
                        tylenol: null
                    }
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null,
                        tylenol: null
                    },
                    Midday: {
                        tylenol: null
                    },
                    PM: {
                        M1: null,
                        tylenol: null
                    },
                    Evening: {
                        tylenol: null
                    }
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                },
                secondaryTracking: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            }
        }
        const action = connectMedFailureTracking('no such user medication exists');
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: 'no such user medication exists',
            history: {}
        }
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('changeMedTracking', () => {
    it('should handle changeMedRequestTracking', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: null,
            history: {}
        }
        const action = changeMedRequestTracking({
            oldMedication: 'M1', 
            newMedication: 'propanalol',
            timeOfDay: ['PM', 'Evening']  
        });
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {
                        propanalol: 1
                    },
                    Evening: {
                        propanalol: null
                    }
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {
                        propanalol: null
                    },
                    Evening: {
                        propanalol: null
                    }
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                },
                secondaryTracking: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            }
        }
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle changeMedSuccessTracking', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {
                        propanalol: 1
                    },
                    Evening: {
                        propanalol: null
                    }
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {
                        propanalol: null
                    },
                    Evening: {
                        propanalol: null
                    }
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                },
                secondaryTracking: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            }
        }
        const action = changeMedSuccessTracking();
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {
                        propanalol: 1
                    },
                    Evening: {
                        propanalol: null
                    }
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {
                        propanalol: null
                    },
                    Evening: {
                        propanalol: null
                    }
                }
            },
            loading: false,
            error: null,
            history: {}
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle changeMedSymptomFailureTracking', () => {       
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {
                        propanalol: 1
                    },
                    Evening: {
                        propanalol: null
                    }
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {
                        propanalol: null
                    },
                    Evening: {
                        propanalol: null
                    }
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                },
                secondaryTracking: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            }
        }
        const action = changeMedFailureTracking('no such user medication exists');
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: 'no such user medication exists',
            history: {}
        }
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});

describe('disconnectFromMedTracking', () => {
    it('should handle disconnectFromMedRequestTracking', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: null,
            history: {}
        }
        const action = disconnectFromMedRequestTracking({
            medication: 'M1' 
        });
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {},
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {},
                    Evening: {}
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                },
                secondaryTracking: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            }
        }
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle disconnectFromMedSuccessTracking', () => {
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {},
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {},
                    Evening: {}
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                },
                secondaryTracking: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            }
        }
        const action = disconnectFromMedSuccessTracking();
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {},
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {},
                    Evening: {}
                }
            },
            loading: false,
            error: null,
            history: {}
        };
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
    it('should handle disconnectFromMedSymptomFailureTracking', () => {       
        const initialState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {},
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {},
                    Midday: {},
                    PM: {},
                    Evening: {}
                }
            },
            loading: true,
            error: null,
            history: {
                primaryTracking: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                },
                secondaryTracking: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            }
        }
        const action = disconnectFromMedFailureTracking('no such user medication exists');
        const expectedState = {
            primaryTracking: {
                symptoms: {
                    S1: {
                        '12-4 AM': 3,
                        '8 AM-12 PM': 2,
                        '12-4 PM': 1
                    }
                },
                medications: {
                    AM: {
                        M1: 2
                    },
                    Midday: {},
                    PM: {
                        M1: 1
                    },
                    Evening: {}
                }
            },
            secondaryTracking: {
                symptoms: {
                    S1: {}
                },
                medications: {
                    AM: {
                        M1: null
                    },
                    Midday: {},
                    PM: {
                        M1: null
                    },
                    Evening: {}
                }
            },
            loading: false,
            error: 'no such user medication exists',
            history: {}
        }
        expect(trackingSlice.reducer(initialState, action)).toEqual(expectedState);
    });
});