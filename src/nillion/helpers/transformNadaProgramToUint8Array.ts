export const transformNadaProgramToUint8Array = async (
  publicProgramPath: string // `./programs/${programName}.nada.bin`
): Promise<Uint8Array> => {
  try {
    const response = await fetch(publicProgramPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch program: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Error fetching and transforming program:', error);
    throw error;
  }
};
